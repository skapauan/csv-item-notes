import * as SQLite from 'expo-sqlite'
import { SQLResultSet, SQLTransaction } from 'expo-sqlite'

export const DBConstants = {
    DatabaseName: 'csv_item_notes',
    ItemsTableName: 'items',
    ItemIdColName: 'item_id',
    ItemNoteColName: 'note',
    ItemColNamePrefix: 'col_',
    ColumnsTableName: 'columns',
    ColumnIdColName: 'column_id',
    ColumnTitleColName: 'title',
}

export const getItemColName = (index: number) => `${DBConstants.ItemColNamePrefix}${index}`

export class DB {
    db: SQLite.Database | undefined
    columnNames: string[] | undefined

    constructor(columnNames?: string[]) {
        this.columnNames = columnNames
    }

    query(query: string | {text: string, values: any[]}, transaction?: SQLTransaction)
            : Promise<SQLResultSet> {
        // Prepare parameters
        let statement: string
        let args: any[] | undefined
        if (typeof query === 'string') {
            statement = query
        } else if (query && typeof query.text === 'string' && typeof query.values === 'object'
                && query.values && typeof query.values.length === 'number') {
            statement = query.text
            args = query.values
        } else {
            return Promise.reject(new Error('Invalid query input'))
        }
        // Use the given transaction
        if (transaction) {
            return new Promise((resolve, reject) => {
                transaction.executeSql(statement, args,
                    // executeSql success
                    (tx, result) => {
                        resolve(result)
                    },
                    // executeSql error
                    (tx, error) => {
                        reject(error)
                        return false // make ts compiler happy
                    }
                )
            })
        }
        // Use a new transaction
        return new Promise((resolve, reject) => {
            const db = this.db || SQLite.openDatabase(DBConstants.DatabaseName)
            db.transaction(
                // transaction callback
                (tx) => {
                    tx.executeSql(statement, args,
                        // executeSql success
                        (tx, result) => {
                            resolve(result)
                        },
                        // executeSql error
                        (tx, error) => {
                            reject(error)
                            return false // make ts compiler happy
                        }
                    )
                },
                // transaction error
                (error) => {
                    reject(error)
                },
                // transaction success
                () => {}
            )
        })
    }

    isInit(): boolean {
        return !!this.db
    }

    init(): Promise<void> {
        if (this.db) {
            return Promise.resolve()
        }
        return new Promise<void>((resolve, reject) => {
            const db = SQLite.openDatabase(DBConstants.DatabaseName)
            db.transaction(
                (tx) => {
                    let createColumnsTableQuery = `CREATE TABLE IF NOT EXISTS
                        ${DBConstants.ColumnsTableName} (
                        ${DBConstants.ColumnIdColName} INTERGER PRIMARY KEY NOT NULL,
                        ${DBConstants.ColumnTitleColName} TEXT
                        );`
                    let readColumnsTableQuery = `SELECT * FROM ${DBConstants.ColumnsTableName};`

                    return this.query(createColumnsTableQuery, tx)
                    .then(() => this.query(readColumnsTableQuery, tx))
                    .then((result) => {
                        if (result.rows.length > 0) {
                            // populate columnNames from columns table
                            this.columnNames = []
                            let row
                            for (let i = 0; !!(row = result.rows.item(i)); i++) {
                                this.columnNames[row.column_id] = row.title
                            }
                            return Promise.resolve()
                        } else {
                            // populate columns table from columnNames
                            const promises: Promise<SQLResultSet>[] = []
                            const text = `INSERT INTO ${DBConstants.ColumnsTableName} (
                                ${DBConstants.ColumnIdColName},
                                ${DBConstants.ColumnTitleColName}) VALUES (?, ?);`
                            this.columnNames?.forEach((title, index) => {
                                let values = [index, title]
                                promises.push(this.query({text, values}, tx))
                            })
                            return Promise.all(promises).then(() => {})
                        }
                    })
                    .then(() => {
                        // create items table with correct column count
                        const itemCols = [
                            `${DBConstants.ItemIdColName} INTERGER PRIMARY KEY NOT NULL`,
                            `${DBConstants.ItemNoteColName} TEXT`
                        ]
                        this.columnNames?.forEach((value, index) => {
                            itemCols.push(`${getItemColName(index)} TEXT`)
                        })
                        let createItemsTableQuery = `CREATE TABLE IF NOT EXISTS
                            ${DBConstants.ItemsTableName} (${itemCols.join(',')});`
                        return this.query(createItemsTableQuery, tx)
                    })
                    .then(() => {
                        this.db = db
                        resolve()
                    })
                    .catch((error) => reject(error))
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }

    end(): void {
        this.db = undefined
    }

    clearAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            const db = this.db || SQLite.openDatabase(DBConstants.DatabaseName)
            this.db = undefined
            db.transaction(
                (tx) => {
                    const dropItemsTable = this.query(
                        `DROP TABLE IF EXISTS ${DBConstants.ItemsTableName};`
                        , tx)
                    const dropColumnsTable = this.query(
                        `DROP TABLE IF EXISTS ${DBConstants.ColumnsTableName};`
                        , tx)
                    Promise.all([dropItemsTable, dropColumnsTable])
                    .then(() => resolve())
                    .catch((error) => reject(error))
                },
                (error) => reject(error)
            )
        })
    }

    createItem(item: (string|null)[], transaction?: SQLTransaction): Promise<void> {
        if (item.length < 1 || item.length !== this.columnNames?.length) {
            return Promise.reject(new Error('Number of columns must match original CSV, '
                + (this.columnNames?.length || 'unknown') + '.'))
        }
        let cl: string[] = []
        let ph: string[] = []
        item.forEach((value, index) => {
            cl.push(getItemColName(index))
            ph.push('?')
        })
        const columns = cl.join(',')
        const placeholders = ph.join(',')
        return this.query({
            values: item,
            text: `INSERT INTO ${DBConstants.ItemsTableName} (${columns}) VALUES (${placeholders});`
        }, transaction).then(() => {})
    }

    updateItemNote(note: string, firstColValue: string, transaction?: SQLTransaction): Promise<boolean> {
        return this.query({
            values: [note, firstColValue],
            text: `UPDATE ${DBConstants.ItemsTableName} SET ${DBConstants.ItemNoteColName} = ?
                WHERE ${getItemColName(0)} = ?;`
        }, transaction).then((result) => {
            if (result.rowsAffected > 0) {
                return true
            }
            return false
        })
    }

}
