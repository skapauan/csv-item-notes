import * as SQLite from 'expo-sqlite'
import { SQLError, SQLResultSet, SQLTransaction } from 'expo-sqlite'
import { DBConstants } from './constants'
import { DBErrors } from './errors'
import { getDataColName, getNoteColName } from './names'
import { DBQueries } from './queries'

export type DBValue = string | number | boolean | null
export type DBQuery = string | { text: string, values: DBValue[] }
export type NotesInput = { colName: string, value: DBValue }[]
export type ItemDataInput = { rows: string[][], hasHeaderRow?: boolean }
export type ItemColumn = {
    name: string;
    type: ColumnType;
    title?: string;
    isNote?: boolean;
}
export type ItemsRow = { [name: string]: DBValue }
export type ItemColsRow = {
    'item_col_id': number;
    'name': string;
    'title': string;
    'is_note': number;
}
export enum ColumnType {
    Text = 'TEXT',
    Numeric = 'NUMERIC', // tries to convert to INTEGER or REAL
    Boolean = 'BOOLEAN', // booleans stored and returned as INTEGER 0 or 1
}
export const ColumnTypes = {
    Text: ColumnType['Text'],
    Numeric: ColumnType['Numeric'],
    Boolean: ColumnType['Boolean'],
}

export class DB {
    db: SQLite.Database
    initStatus: boolean
    itemColumns: ItemColumn[]
    savedQueries = {
        firstDataColumnName: '',
        itemColumnNames: [''],
        selectItemByFirstDataValue: '',
    }

    constructor() {
        this.db = SQLite.openDatabase(DBConstants.Database)
        this.initStatus = false
        this.itemColumns = []
    }

    updateSavedQueries() {
        const q = this.savedQueries
        let firstDataCol = this.itemColumns.find((col) => !col.isNote)
        if (!firstDataCol) {
            firstDataCol = this.itemColumns.find((col) => 
                col.name.startsWith(DBConstants.Items.DataPrefix))
        }
        q.firstDataColumnName = firstDataCol ? firstDataCol.name : DBConstants.Items.Id
        q.itemColumnNames = this.itemColumns.map((col) => col.name)
        q.selectItemByFirstDataValue = DBQueries.getSelectItemsWithColumnValue(
            q.firstDataColumnName, q.itemColumnNames, true
        )
    }

    query(
        query: DBQuery,
        transaction?: SQLTransaction,
        rollbackIfError: boolean = false
    ): Promise<SQLResultSet> {
        // Prepare parameters
        let statement: string
        let args: any[] | undefined
        if (typeof query === 'string') {
            statement = query
        } else if (query && typeof query.text === 'string'
                && query.values && typeof query.values === 'object'
                && typeof query.values.length === 'number') {
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
                        return rollbackIfError
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
                            return rollbackIfError
                        }
                    )
                },
                // transaction error
                (error) => {},
                // transaction success
                () => {}
            )
        })
    }

    queryMany(
        queries: DBQuery[],
        onQueryDone?: (queryIndex: number) => void,
        rollbackIfError: boolean = false
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            // Prepare parameters
            const ql = queries.length
            const queryStatements: string[] = []
            const queryArgs: (any[] | undefined)[] = []
            for (let i = 0; i < ql; i++) {
                const query = queries[i]
                if (typeof query === 'string') {
                    queryStatements[i] = query
                    queryArgs[i] = undefined
                } else if (query && typeof query.text === 'string'
                        && query.values && typeof query.values === 'object'
                        && typeof query.values.length === 'number') {
                    queryStatements[i] = query.text
                    queryArgs[i] = query.values
                } else {
                    reject(new Error('Invalid query input'))
                    return
                }
            }
            // Queue the queries on a transaction
            this.db.transaction(
                // transaction callback
                (tx) => {
                    const sqlError = () => rollbackIfError
                    if (onQueryDone) {
                        const sqlSuccess = (i: number) => () => onQueryDone(i)
                        for (let i = 0; i < ql; i++) {
                            tx.executeSql(queryStatements[i], queryArgs[i],
                                sqlSuccess(i), sqlError)
                        }
                    } else {
                        for (let i = 0; i < ql; i++) {
                            tx.executeSql(queryStatements[i], queryArgs[i],
                                undefined, sqlError)
                        }
                    }
                },
                // transaction error
                (error) => { reject(error) },
                // transaction success
                () => { resolve() }
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
                if (row.name === DBConstants.Items.Id) continue
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
            this.updateSavedQueries()
            this.initStatus = true
        } catch (e) {
            return Promise.reject(e)
        }
    }

    setItemsFromData(
        itemData: ItemDataInput,
        getProgress?: (done: number, total: number) => void
    ): Promise<void> {
        // Check input validity
        const { rows } = itemData
        const hasHeaderRow = itemData.hasHeaderRow !== false
        const firstRow = rows[0]
        const numCols = firstRow.length
        const numRows = rows.length
        if ( hasHeaderRow ? numRows < 2 : numRows < 1 ) {
            return Promise.reject(new Error(DBErrors.INVALID_NUMBER_ROWS))
        }
        if ( numCols < 1 ) {
            return Promise.reject(new Error(DBErrors.INVALID_NUMBER_COLUMNS))
        }
        for (let i = 0; i < numRows; i++) {
            if (rows[i].length !== numCols) {
                return Promise.reject(new Error(DBErrors.INVALID_FIELD_VARIANCE))
            }
        }
        // Populate DB.itemColumns; Construct queries to populate ItemCols table
        this.itemColumns = []
        const queries: DBQuery[] = [
            DBQueries.DropItems,
            DBQueries.DropItemCols,
            DBQueries.CreateItemCols,
        ]
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
        this.updateSavedQueries()
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
        const total = queries.length
        if (getProgress) getProgress(0, total)
        const onQueryDone = getProgress
            ? (queryIndex: number) => getProgress(++queryIndex, total)
            : undefined
        return this.queryMany(queries, onQueryDone, true).then(() => {})
    }

    findItemsByColumnValue(columnName: string, columnValue: DBValue, limitOne?: boolean
    , transaction?: SQLTransaction): Promise<DBValue[][]> {
        return this.query({
            text: DBQueries.getSelectItemsWithColumnValue(
                columnName, this.savedQueries.itemColumnNames, limitOne),
            values: [columnValue],
        }, transaction)
        .then((result) => this.getItemColumnValuesFromResult(result))
    }

    findItemByFirstDataValue(value: DBValue, transaction?: SQLTransaction)
    : Promise<DBValue[] | undefined> {
        return this.query({
            text: this.savedQueries.selectItemByFirstDataValue,
            values: [value],
        }, transaction)
        .then((result) => this.getItemColumnValuesFromResult(result)[0])
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

    clearAll(): Promise<void> {
        this.initStatus = false
        this.itemColumns = []
        return this.queryMany([
            DBQueries.DropItems,
            DBQueries.DropItemCols,
        ])
        .then(() => {})
    }

    getItemColumnValuesFromResult = (result: SQLResultSet): DBValue[][] => {
        const output: DBValue[][] = []
        const ic = this.itemColumns
        const icl = this.itemColumns.length
        if (result.rows.length > 0) {
            for (let i = 0, row: ItemsRow; !!(row = result.rows.item(i)); i++) {
                const valueRow: DBValue[] = []
                for (let j = 0; j < icl; j++) {
                    const col = ic[j]
                    let value = row[col.name]
                    if (typeof value === 'undefined') {
                        value = null
                    } else if (col.type === ColumnTypes.Boolean) {
                        value = value === 1 ? true : null
                    }
                    valueRow.push(value)
                }
                output.push(valueRow)
            }
        }
        return output
    }

}
