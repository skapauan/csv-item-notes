import * as SQLite from 'expo-sqlite'
import { SQLResultSet, SQLTransaction } from 'expo-sqlite'
import { DBConstants } from './constants'
import { DBErrors } from './errors'
import { getDataColName, getLastColNumber, getLastOrder, getNoteColName }
    from './names'
import { DBQueries } from './queries'
import { getItemColumnValues } from './results'
import { ColumnType, ColumnTypes, CreateNoteInput, DBQuery, DBValue,
    EditNoteInput, ItemColsRow, ItemColumn, ItemDataInput, NotesInput }
    from './types'

export class DB {
    db: SQLite.Database
    initStatus: boolean
    itemColumns: ItemColumn[]
    savedQueries = {
        firstDataColumnName: '',
        itemColumnNames: [] as string[],
        selectItemByFirstDataValue: '',
    }

    constructor() {
        this.db = SQLite.openDatabase(DBConstants.Database)
        this.initStatus = false
        this.itemColumns = []
    }

    updateSavedQueries(): void {
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
            // Execute the queries on one transaction
            this.db.transaction(
                // transaction callback
                (tx) => {
                    const sqlError = () => rollbackIfError
                    for (let i = 0; i < ql; i++) {
                        tx.executeSql(queryStatements[i], queryArgs[i],
                            undefined, sqlError)
                    }
                },
                // transaction error
                (error) => { reject(error) },
                // transaction success
                () => { resolve() }
            )
        })
    }

    queryManyInChunks(
        queries: DBQuery[],
        getProgress: (queriesCompleted: number) => void = () => {},
        chunkSize: number = 1000,
    ): Promise<void> {
        // Divide queries into chunks, use queryMany() for each chunk
        chunkSize = Math.floor(chunkSize)
        if (chunkSize < 1) {
            return Promise.reject(new Error('Chunk size must be greater than or equal to 1.'))
        }
        try {
            getProgress(0)
        } catch (e) {
            return Promise.reject(new Error('Input function getProgress() threw error'))
        }
        const promises = []
        const ql = queries.length
        for (let start = 0, count = 0; start < ql; start += chunkSize) {
            const chunkQueries = queries.slice(start, start + chunkSize)
            count += chunkQueries.length
            const completed = count
            promises.push(
                this.queryMany(chunkQueries).then(() => getProgress(completed))
            )
        }
        return Promise.all(promises).then(() => {})
    }

    isInit(): boolean {
        return this.initStatus
    }

    async init(): Promise<void> {
        if (this.initStatus) return
        try {
            // Cannot proceed without an Items table with at least one row
            if (!(await this.hasTable(DBConstants.Items.Table))) {
                return Promise.reject(new Error(DBErrors.NO_ITEM_TABLE))
            }
            if (await this.isTableEmpty(DBConstants.Items.Table)) {
                return Promise.reject(new Error(DBErrors.NO_ITEM_ROWS))
            }
            // Populate DB.itemColumns from Items table_info and ItemCols rows
            this.itemColumns = []
            const info = await this.query(DBQueries.SelectItemsTableInfo)
            for (let i = 0, row; !!(row = info.rows.item(i)); i++) {
                if (row.name === DBConstants.Items.Id) continue
                this.itemColumns.push({ index: i, name: row.name, type: row.type })
            }
            if (await this.hasTable(DBConstants.ItemCols.Table)) {
                const result = await this.query(DBQueries.SelectAllItemCols)
                for (let i = 0, row: ItemColsRow; !!(row = result.rows.item(i)); i++) {
                    const ic = this.itemColumns.find((col) => col.name === row.name)
                    if (ic) {
                        ic.id = row.item_col_id
                        ic.title = row.title || ic.name
                        ic.isNote = row.is_note !== 0
                        if (typeof row.note_order === 'number')
                            ic.order = row.note_order
                    }
                }
            }
            this.updateSavedQueries()
            this.initStatus = true
        } catch (e) {
            this.initStatus = false
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
        // Construct queries to drop tables and create ItemCols table
        const queries: DBQuery[] = [
            DBQueries.DropItems,
            DBQueries.DropItemCols,
            DBQueries.CreateItemCols,
        ]
        // Construct queries to populate ItemCols table
        const columns = []
        let orderCounter = 0
        for (let i = 0; i < numCols; i++) {
            let name = getDataColName(i)
            let title = name
            let type: ColumnType = ColumnTypes.Text
            let isNote = false
            let order = null
            if (hasHeaderRow) {
                title = firstRow[i]
                if (title.startsWith(DBConstants.CsvNotePrefix)) {
                    isNote = true
                    order = orderCounter++
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
            columns.push({ name, type, isNote })
            queries.push({
                text: DBQueries.InsertItemCol,
                values: [name, title, isNote, order],
            })
        }
        // Construct queries to create and populate Items table
        const colDecs: string[] = []
        const colNames: string[] = []
        columns.forEach((col) => {
            colDecs.push(`${col.name} ${col.type}`)
            colNames.push(col.name)
        })
        queries.push(DBQueries.getCreateItems(colDecs))
        const insertItem = DBQueries.getInsertItem(colNames)
        for (let i = hasHeaderRow ? 1 : 0; i < numRows; i++) {
            const row = rows[i], values: DBValue[] = []
            for (let j = 0; j < numCols; j++) {
                let value: DBValue = row[j]
                const col = columns[j]
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
        const progress = getProgress
            ? (done: number) => getProgress(done, total)
            : undefined
        return this.queryManyInChunks(queries, progress)
        .then(() => {
            this.initStatus = false
            return this.init()
        })
    }

    findItemsByColumnValue(columnName: string, columnValue: DBValue, limitOne?: boolean
    , transaction?: SQLTransaction): Promise<DBValue[][]> {
        return this.query({
            text: DBQueries.getSelectItemsWithColumnValue(
                columnName, this.savedQueries.itemColumnNames, limitOne),
            values: [columnValue],
        }, transaction)
        .then((result) => getItemColumnValues(result, this.itemColumns))
    }

    findItemByFirstDataValue(value: DBValue, transaction?: SQLTransaction)
    : Promise<DBValue[] | undefined> {
        return this.query({
            text: this.savedQueries.selectItemByFirstDataValue,
            values: [value],
        }, transaction)
        .then((result) => getItemColumnValues(result, this.itemColumns)[0])
    }

    createNoteColumns(columns: CreateNoteInput[]): Promise<void> {
        const queries: DBQuery[] = []
        let lastColNum = getLastColNumber(this.itemColumns)
        let lastOrder = getLastOrder(this.itemColumns)
        columns.forEach((col) => {
            const name = getNoteColName(++lastColNum)
            const order = ++lastOrder
            queries.push(DBQueries.getAlterItemsAddColumn(name, col.type))
            queries.push({
                text: DBQueries.InsertItemCol,
                values: [name, col.title, true, order],
            })
        })
        return this.queryMany(queries, true)
        .then(() => {
            this.initStatus = false
            return this.init()
        })
    }
    
    updateNoteColumns(columns: EditNoteInput[]): Promise<void> {
        const queries: DBQuery[] = []
        columns.forEach((col) => {
            const query = DBQueries.getUpdateItemCol(col)
            if (query) queries.push(query)
        })
        return this.queryMany(queries, true)
        .then(() => {
            this.initStatus = false
            return this.init()
        })
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

}
