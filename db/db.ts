import * as SQLite from 'expo-sqlite'
import { SQLResultSet, SQLTransaction } from 'expo-sqlite'
import { DBErrors } from './errors'
import { DBQueries } from './queries'
import { DBConstants, DBValue, ColumnType, ColumnTypes, ItemColsRow } from './constants'
import { getDataColName, getNoteColName } from './names'

export type DBQuery = string | { text: string, values: DBValue[] }
export type ItemDataInput = { rows: string[][], hasHeaderRow?: boolean }
export type ItemColumn = {
    name: string;
    type: ColumnType;
    title?: string;
    isNote?: boolean;
}
export type NotesInput = { colName: string, value: DBValue }[]

export class DB {
    db: SQLite.Database
    initStatus: boolean
    itemColumns: ItemColumn[]

    constructor() {
        this.db = SQLite.openDatabase(DBConstants.Database)
        this.initStatus = false
        this.itemColumns = []
    }

    query(query: DBQuery, transaction?: SQLTransaction)
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
            this.db.transaction(
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

    queryParallel(queries: DBQuery[], transaction?: SQLTransaction)
    : Promise<SQLResultSet[]> {
        const promises: Promise<SQLResultSet>[] = []
        queries.forEach((query) => {
            promises.push(this.query(query, transaction))
        })
        return Promise.all(promises)
        .then(results => results)
        .catch(error => Promise.reject(error))
    }

    isInit(): boolean {
        return this.initStatus
    }

    async init(transaction?: SQLTransaction): Promise<void> {
        if (this.initStatus) return
        try {
            // Cannot proceed without an Items table with at least one row
            if (!(await this.hasTable(DBConstants.Items.Table, transaction))) {
                return Promise.reject(new Error(DBErrors.NO_ITEM_TABLE))
            }
            if (await this.isTableEmpty(DBConstants.Items.Table, transaction)) {
                return Promise.reject(new Error(DBErrors.NO_ITEM_ROWS))
            }
            // Populate DB.itemColumns from Items table_info and ItemCols rows
            this.itemColumns = []
            const info = await this.query(DBQueries.SelectItemsTableInfo, transaction)
            for (let i = 0, row; !!(row = info.rows.item(i)); i++) {
                this.itemColumns.push({ name: row.name, type: row.type })
            }
            if (await this.hasTable(DBConstants.ItemCols.Table, transaction)) {
                const result = await this.query(DBQueries.SelectAllItemCols, transaction)
                for (let i = 0, row: ItemColsRow; !!(row = result.rows.item(i)); i++) {
                    const ic = this.itemColumns.find((col) => col.name === row.name)
                    if (ic) {
                        ic.title = row.title || ic.name
                        ic.isNote = row.is_note !== 0
                    }
                }
            }
            this.initStatus = true
        } catch (e) {
            return Promise.reject(e)
        }
    }

    setItemsFromData(itemData: ItemDataInput, transaction?: SQLTransaction): Promise<void> {
        // Check input validity
        if (!itemData || !itemData.rows
            || typeof itemData.rows.length !== 'number'
            || itemData.rows.length < 1
            || itemData.rows[0].length < 1)
        {
            return Promise.reject(new Error(DBErrors.INVALID_DATA_FORMAT))
        }
        const { hasHeaderRow, rows } = itemData
        const firstRow = rows[0]
        const numCols = firstRow.length
        const numRows = rows.length
        for (let i = 0; i < numRows; i++) {
            if (rows[i].length !== numCols) {
                return Promise.reject(new Error(DBErrors.INVALID_FIELD_VARIANCE))
            }
        }
        // Populate DB.itemColumns; Construct queries to populate ItemCols table
        this.itemColumns = []
        const queries: DBQuery[] = [ DBQueries.CreateItemCols ]
        for (let i = 0; i < numCols; i++) {
            let name = getDataColName(i), title = name,
                isNote = false, type: ColumnType = ColumnTypes.Text
            if (hasHeaderRow) {
                title = firstRow[i]
                if (title.startsWith(DBConstants.CsvNotePrefix)) {
                    isNote = true
                    name = getNoteColName(i)
                    title = title.slice(DBConstants.CsvNotePrefix.length)
                    const suffixIndex = title.indexOf(DBConstants.CsvNoteTypeSuffix)
                    if (suffixIndex > -1) {
                        const typeString = title.slice(0, suffixIndex)
                        title = title.slice(suffixIndex + DBConstants.CsvNoteTypeSuffix.length)
                        switch (typeString) {
                            case ColumnTypes.Boolean:
                            case ColumnTypes.Numeric:
                                type = typeString
                                break
                            default:
                                type = ColumnTypes.Text
                        }
                    }
                }
            }
            this.itemColumns.push({ name, type, title, isNote })
            queries.push({
                text: DBQueries.InsertItemCol,
                values: [name, title, isNote],
            })
        }
        // Construct queries to create and populate Items table
        const colDecs: string[] = []
        const colNames: string[] = []
        this.itemColumns.forEach((col) => {
            colDecs.push(`${col.name} ${col.type}`)
            colNames.push(col.name)
        })
        queries.push(DBQueries.getCreateItems(colDecs))
        const insertItem = DBQueries.getInsertItem(colNames)
        for (let i = 0; i < numRows; i++) {
            const row = rows[i], values: DBValue[] = []
            for (let j = 0; j < numCols; j++) {
                let value: DBValue = row[j]
                const col = this.itemColumns[j]
                if (col.isNote) {
                    if (col.type === ColumnTypes.Boolean) {
                        value = (value === '1') ? 1 : null
                    } else {
                        value = (value.length > 0) ? value : null
                    }
                }
                values.push(value)
            }
            queries.push({ text: insertItem, values })
        }
        // Execute queries
        return this.queryParallel(queries).then(() => {})
    }

    findItemsByColumnValue(columnName: string, columnValue: DBValue, limitOne?: boolean
    , transaction?: SQLTransaction): Promise<SQLResultSet> {
        return this.query({
            text: DBQueries.getSelectItemsWithColumnValue(columnName, limitOne),
            values: [columnValue],
        }, transaction)
    }

    updateItemNotes(itemId: number, notes: NotesInput, transaction?: SQLTransaction)
    : Promise<void> {
        const colNames: string[] = []
        const values: DBValue[] = []
        notes.forEach((note) => {
            colNames.push(note.colName)
            values.push(note.value)
        })
        values.push(itemId)
        return this.query({
            text: DBQueries.getUpdateItemNotes(colNames),
            values,
        }).then(() => {})
    }

    hasTable(name: string, transaction?: SQLTransaction): Promise<boolean> {
        return this.query(DBQueries.getSelectTableWithName(name), transaction)
        .then(({ rows }) => {
            return rows.length > 0
        })
    }

    isTableEmpty(name: string, transaction?: SQLTransaction): Promise<boolean> {
        return this.query(DBQueries.getSelectTableIsEmpty(name), transaction)
        .then(({ rows }) => {
            return rows.item(0).isempty === 1
        })
    }

    clearAll(transaction?: SQLTransaction): Promise<void> {
        this.initStatus = false
        return this.queryParallel([
            DBQueries.DropItems,
            DBQueries.DropItemCols,
        ], transaction)
        .then(() => {})
    }

}
