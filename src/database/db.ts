import * as SQLite from 'expo-sqlite'
import { SQLResultSet, SQLTransaction } from 'expo-sqlite'
import { DBConstants } from './constants'
import { DBErrors } from './errors'
import {
    getDataColName,
    getLastColNumber,
    getLastOrder,
    getNoteColName,
} from './names'
import { DBQueries } from './queries'
import { getItemOutputs, isTruthyValue } from './results'
import {
    ColumnType,
    ColumnTypes,
    CreateNoteInput,
    DBQuery,
    DBValue,
    EditNoteInput,
    ItemColsRow,
    ItemColumn,
    ItemDataInput,
    ItemOutput,
} from './types'

export class DB {
    db: SQLite.Database
    initStatus: boolean
    itemColumns: ItemColumn[]
    savedQueries = {
        firstDataColumnName: '',
        allColumnNames: [] as string[],
        dataColumnNames: [] as string[],
        noteColumnNames: [] as string[],
        selectItemByFirstValue: '',
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
                col.name.startsWith(DBConstants.Items.DataPrefix),
            )
        }
        q.firstDataColumnName = firstDataCol
            ? firstDataCol.name
            : DBConstants.Items.Id
        q.allColumnNames = this.itemColumns.map((col) => col.name)
        q.allColumnNames.push(DBConstants.Items.Id)
        q.dataColumnNames = this.itemColumns
            .filter((col) => !col.isNote)
            .map((col) => col.name)
        q.noteColumnNames = this.itemColumns
            .filter((col) => col.isNote)
            .map((col) => col.name)
        q.selectItemByFirstValue = DBQueries.getSelectItemsWithColumnValue(
            q.firstDataColumnName,
            q.allColumnNames,
            true,
        )
    }

    query(
        query: DBQuery,
        transaction?: SQLTransaction,
        rollbackIfError = false,
    ): Promise<SQLResultSet> {
        // Prepare parameters
        let statement: string
        let args: DBValue[] | undefined
        if (typeof query === 'string') {
            statement = query
        } else if (
            query &&
            typeof query.text === 'string' &&
            query.values &&
            typeof query.values === 'object' &&
            typeof query.values.length === 'number'
        ) {
            statement = query.text
            args = query.values
        } else {
            return Promise.reject(new Error('Invalid query input'))
        }
        // Use the given transaction
        if (transaction) {
            return new Promise((resolve, reject) => {
                transaction.executeSql(
                    statement,
                    args,
                    // executeSql success
                    (tx, result) => {
                        resolve(result)
                    },
                    // executeSql error
                    (tx, error) => {
                        reject(error)
                        return rollbackIfError
                    },
                )
            })
        }
        // Use a new transaction
        return new Promise((resolve, reject) => {
            this.db.transaction(
                // transaction callback
                (tx) => {
                    tx.executeSql(
                        statement,
                        args,
                        // executeSql success
                        (tx, result) => {
                            resolve(result)
                        },
                        // executeSql error
                        (tx, error) => {
                            reject(error)
                            return rollbackIfError
                        },
                    )
                },
                // transaction error
                undefined,
                // transaction success
                undefined,
            )
        })
    }

    queryMany(queries: DBQuery[], rollbackIfError = false): Promise<void> {
        return new Promise((resolve, reject) => {
            // Prepare parameters
            const ql = queries.length
            const queryStatements: string[] = []
            const queryArgs: (DBValue[] | undefined)[] = []
            for (let i = 0; i < ql; i++) {
                const query = queries[i]
                if (typeof query === 'string') {
                    queryStatements[i] = query
                    queryArgs[i] = undefined
                } else if (
                    query &&
                    typeof query.text === 'string' &&
                    query.values &&
                    typeof query.values === 'object' &&
                    typeof query.values.length === 'number'
                ) {
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
                        tx.executeSql(
                            queryStatements[i],
                            queryArgs[i],
                            undefined,
                            sqlError,
                        )
                    }
                },
                // transaction error
                (error) => {
                    reject(error)
                },
                // transaction success
                () => {
                    resolve()
                },
            )
        })
    }

    queryManyInChunks(
        queries: DBQuery[],
        getProgress: (queriesCompleted: number) => void = () => undefined,
        chunkSize = 1000,
    ): Promise<void> {
        // Divide queries into chunks, use queryMany() for each chunk
        chunkSize = Math.floor(chunkSize)
        if (chunkSize < 1) {
            return Promise.reject(
                new Error('Chunk size must be greater than or equal to 1.'),
            )
        }
        try {
            getProgress(0)
        } catch (e) {
            return Promise.reject(
                new Error('Input function getProgress() threw error'),
            )
        }
        const promises = []
        const ql = queries.length
        for (let start = 0, count = 0; start < ql; start += chunkSize) {
            const chunkQueries = queries.slice(start, start + chunkSize)
            count += chunkQueries.length
            const completed = count
            promises.push(
                this.queryMany(chunkQueries).then(() => getProgress(completed)),
            )
        }
        return Promise.all(promises).then(() => undefined)
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
            let index = 0
            const info = await this.query(DBQueries.PragmaTableInfoItems)
            for (let i = 0, row; !!(row = info.rows.item(i)); i++) {
                if (row.name === DBConstants.Items.Id) continue
                this.itemColumns.push({
                    index: index++,
                    name: row.name,
                    type: row.type,
                })
            }
            if (await this.hasTable(DBConstants.ItemCols.Table)) {
                const result = await this.query(DBQueries.SelectAllItemCols)
                for (
                    let i = 0, row: ItemColsRow;
                    !!(row = result.rows.item(i));
                    i++
                ) {
                    const ic = this.itemColumns.find(
                        (col) => col.name === row.name,
                    )
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
        getProgress?: (done: number, total: number) => void,
    ): Promise<void> {
        // Check input validity
        const { rows } = itemData
        const hasHeaderRow = itemData.hasHeaderRow !== false
        const firstRow = rows[0]
        const numCols = firstRow.length
        const numRows = rows.length
        if (hasHeaderRow ? numRows < 2 : numRows < 1) {
            return Promise.reject(new Error(DBErrors.INVALID_NUMBER_ROWS))
        }
        if (numCols < 1) {
            return Promise.reject(new Error(DBErrors.INVALID_NUMBER_COLUMNS))
        }
        for (let i = 0; i < numRows; i++) {
            if (rows[i].length !== numCols) {
                return Promise.reject(
                    new Error(DBErrors.INVALID_FIELD_VARIANCE),
                )
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
                    const suffixIndex = title.indexOf(
                        DBConstants.CsvNoteTypeSuffix,
                    )
                    if (suffixIndex > -1) {
                        const typeString = title.slice(0, suffixIndex)
                        title = title.slice(
                            suffixIndex + DBConstants.CsvNoteTypeSuffix.length,
                        )
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
        const colNames: string[] = []
        const colTypes: ColumnType[] = []
        columns.forEach((col) => {
            colNames.push(col.name)
            colTypes.push(col.type)
        })
        queries.push(DBQueries.getCreateItems(colNames, colTypes))
        const insertItem = DBQueries.getInsertItem(colNames)
        for (let i = hasHeaderRow ? 1 : 0; i < numRows; i++) {
            const row = rows[i],
                values: DBValue[] = []
            for (let j = 0; j < numCols; j++) {
                let value: DBValue = row[j]
                const col = columns[j]
                if (col.isNote) {
                    if (col.type === ColumnTypes.Boolean) {
                        value = isTruthyValue(value)
                    } else {
                        value = value.length > 0 ? value : null
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
        return this.queryManyInChunks(queries, progress).then(() => {
            this.initStatus = false
            return this.init()
        })
    }

    getDataFromItems(withNotesOnly = false): Promise<DBValue[][]> {
        const notNullCols = withNotesOnly
            ? this.savedQueries.noteColumnNames
            : undefined
        return this.query(
            DBQueries.getSelectAllItems(
                this.savedQueries.allColumnNames,
                notNullCols,
            ),
        ).then((result) => {
            const outputs = getItemOutputs(result, this.itemColumns)
            const headerRow = this.itemColumns.map(
                ({ isNote, name, title, type }) => {
                    if (!title) return name
                    if (!isNote) return title
                    return (
                        DBConstants.CsvNotePrefix +
                        type +
                        DBConstants.CsvNoteTypeSuffix +
                        title
                    )
                },
            )
            const itemRows = outputs.map((output) => output.itemColumnValues)
            return [headerRow, ...itemRows]
        })
    }

    findItemsByColumnValue(
        columnName: string,
        columnValue: DBValue,
        limitOne?: boolean,
        transaction?: SQLTransaction,
    ): Promise<ItemOutput[]> {
        return this.query(
            {
                text: DBQueries.getSelectItemsWithColumnValue(
                    columnName,
                    this.savedQueries.allColumnNames,
                    limitOne,
                ),
                values: [columnValue],
            },
            transaction,
        ).then((result) => getItemOutputs(result, this.itemColumns))
    }

    findItemByFirstValue(
        columnValue: DBValue,
        transaction?: SQLTransaction,
    ): Promise<ItemOutput | undefined> {
        return this.query(
            {
                text: this.savedQueries.selectItemByFirstValue,
                values: [columnValue],
            },
            transaction,
        ).then((result) => getItemOutputs(result, this.itemColumns)[0])
    }

    createItems(items: DBValue[][]): Promise<void> {
        const colNames = this.savedQueries.dataColumnNames
        const colLength = colNames.length
        const itemsLength = items.length
        for (let i = 0; i < itemsLength; i++) {
            if (items[i].length !== colLength) {
                console.log(items[i].length + ' ' + colLength)
                return Promise.reject(
                    new Error(
                        'Item data length and data column length do not match',
                    ),
                )
            }
        }
        const insertItem = DBQueries.getInsertItem(colNames)
        const queries: DBQuery[] = []
        for (let i = 0; i < itemsLength; i++) {
            queries.push({ text: insertItem, values: items[i] })
        }
        return this.queryMany(queries)
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
        return this.queryMany(queries, true).then(() => {
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
        return this.queryMany(queries, true).then(() => {
            this.initStatus = false
            return this.init()
        })
    }

    removeNoteColumns(columns: EditNoteInput[]): Promise<void> {
        const ids: number[] = columns.map((col) => col.id)
        const remainingCols = this.itemColumns.filter((ic) => {
            if (typeof ic.id === 'number') {
                const index = ids.indexOf(ic.id)
                if (index > -1) {
                    ids.splice(index, 1)
                    return false
                }
            }
            return true
        })
        const colNames: string[] = []
        const colTypes: ColumnType[] = []
        remainingCols.forEach((col) => {
            colNames.push(col.name)
            colTypes.push(col.type)
        })
        const queries: DBQuery[] = []
        queries.push(DBQueries.getCreateItems(colNames, colTypes, true))
        queries.push(DBQueries.getInsertItemsCopy(colNames))
        queries.push(DBQueries.DropItems)
        queries.push(DBQueries.AlterRenameItemsCopy)
        columns.forEach(({ id }) => {
            queries.push(DBQueries.getDeleteItemColById(id))
        })
        return this.queryMany(queries, true).then(() => {
            this.initStatus = false
            return this.init()
        })
    }

    updateItemById(
        itemId: number,
        columns: ItemColumn[],
        values: DBValue[],
    ): Promise<void> {
        if (columns.length !== values.length)
            return Promise.reject(new Error(DBErrors.INPUT_ARRAYS_UNEVEN))
        if (columns.length === 0) return Promise.resolve()
        const colNames = columns.map((col) => col.name)
        return this.query({
            text: DBQueries.getUpdateItemById(colNames),
            values: [...values, itemId],
        }).then(() => undefined)
    }

    hasTable(name: string, transaction?: SQLTransaction): Promise<boolean> {
        return this.query(
            DBQueries.getSelectTableWithName(name),
            transaction,
        ).then(({ rows }) => {
            return rows.length > 0
        })
    }

    isTableEmpty(name: string, transaction?: SQLTransaction): Promise<boolean> {
        return this.query(
            DBQueries.getSelectTableIsEmpty(name),
            transaction,
        ).then(({ rows }) => {
            return rows.item(0).isempty === 1
        })
    }

    clearAll(): Promise<void> {
        this.initStatus = false
        this.itemColumns = []
        return this.queryMany([
            DBQueries.DropItems,
            DBQueries.DropItemCols,
        ]).then(() => undefined)
    }
}
