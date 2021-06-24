import { DBConstants } from './constants'
import { ColumnType, DBQuery, DBValue, EditNoteInput } from './types'

const allDoubleQuotes = /"/g
const identifier = (s: string): string =>
    '"' + s.replace(allDoubleQuotes, '""') + '"'

const commaList = (ss: string[]): string => ss.join(', ')
const commaListIdentifiers = (ss: string[]): string =>
    commaList(ss.map((s) => identifier(s)))

const ITEM_COLS = identifier(DBConstants.ItemCols.Table)
const ITEM_COL_ID = identifier(DBConstants.ItemCols.Id)
const ITEM_COL_ISNOTE = identifier(DBConstants.ItemCols.IsNote)
const ITEM_COL_NAME = identifier(DBConstants.ItemCols.Name)
const ITEM_COL_ORDER = identifier(DBConstants.ItemCols.Order)
const ITEM_COL_TITLE = identifier(DBConstants.ItemCols.Title)
const ITEMS = identifier(DBConstants.Items.Table)
const ITEMS_COPY = identifier(DBConstants.Items.TableCopy)
const ITEM_ID = identifier(DBConstants.Items.Id)

export const DBQueries = {
    getAlterItemsAddColumn: (
        columnName: string,
        columnType: ColumnType,
    ): DBQuery =>
        `ALTER TABLE ${ITEMS} ADD COLUMN` +
        ` ${identifier(columnName)} ${columnType};`,

    getCreateItems: (
        columnNames: string[],
        columnTypes: ColumnType[],
        isCopy = false,
    ): DBQuery => {
        const columnDeclarations = [`${ITEM_ID} INTEGER PRIMARY KEY NOT NULL`]
        columnNames.forEach((colName, index) => {
            let colType = columnTypes[index]
            if (colType === undefined) colType = ColumnType.Text
            columnDeclarations.push(`${identifier(colName)} ${colType}`)
        })
        const table = isCopy ? ITEMS_COPY : ITEMS
        return (
            `CREATE TABLE IF NOT EXISTS ${table}` +
            ` (${commaList(columnDeclarations)});`
        )
    },

    getDeleteItemColById: (id: number): DBQuery => ({
        text: `DELETE FROM ${ITEM_COLS} WHERE ${ITEM_COL_ID} = ?;`,
        values: [id],
    }),

    getInsertItem: (columnNames: string[]): string => {
        const placeholders = columnNames.map(() => '?')
        return (
            `INSERT INTO ${ITEMS} (${commaListIdentifiers(columnNames)})` +
            ` VALUES (${commaList(placeholders)});`
        )
    },

    getInsertItemsCopy: (columnNames: string[]): DBQuery => {
        const nameList = commaListIdentifiers(columnNames)
        return (
            `INSERT INTO ${ITEMS_COPY} (${nameList})` +
            ` SELECT ${nameList} FROM ${ITEMS};`
        )
    },

    getSelectAllItems: (
        selectColumnNames?: string[],
        notNullColNames?: string[],
    ): DBQuery => {
        let cols = '*'
        if (selectColumnNames && selectColumnNames.length > 0) {
            cols = commaListIdentifiers(selectColumnNames)
        }
        if (!notNullColNames) {
            return `SELECT ${cols} FROM ${ITEMS};`
        }
        const conditions =
            notNullColNames.length > 0
                ? notNullColNames
                      .map((n) => `${identifier(n)} IS NOT NULL`)
                      .join(' OR ')
                : '0=1'
        return `SELECT ${cols} FROM ${ITEMS} WHERE ${conditions};`
    },

    getSelectTableWithName: (tableName: string): DBQuery => ({
        text: `SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?;`,
        values: [tableName],
    }),

    getSelectTableIsEmpty: (tableName: string): DBQuery =>
        `SELECT CASE WHEN EXISTS (SELECT 1 FROM ${identifier(tableName)})` +
        ` THEN 0 ELSE 1 END AS isempty;`,

    getSelectItemsWithColumnValue: (
        columnName: string,
        selectColumnNames?: string[],
        limitOne?: boolean,
    ): string => {
        let cols = '*'
        if (selectColumnNames && selectColumnNames.length > 0) {
            cols = commaListIdentifiers(selectColumnNames)
        }
        return (
            `SELECT ${cols} FROM ${ITEMS} WHERE` +
            ` ${identifier(columnName)} = ? ${limitOne ? 'LIMIT 1' : ''};`
        )
    },

    getUpdateItemCol: ({
        id,
        title,
        order,
    }: EditNoteInput): DBQuery | undefined => {
        const sets: string[] = []
        const values: DBValue[] = []
        if (typeof title === 'string') {
            sets.push(`${ITEM_COL_TITLE} = ?`)
            values.push(title)
        }
        if (typeof order === 'number') {
            sets.push(`${ITEM_COL_ORDER} = ?`)
            values.push(order)
        }
        if (sets.length < 1) return
        values.push(id)
        return {
            text:
                `UPDATE ${ITEM_COLS} SET ${commaList(sets)}` +
                ` WHERE ${ITEM_COL_ID} = ?;`,
            values,
        }
    },

    getUpdateItemById: (columnNames: string[]): string => {
        const sets = columnNames.map((colName) => `${identifier(colName)} = ?`)
        return `UPDATE ${ITEMS} SET ${commaList(sets)} WHERE ${ITEM_ID} = ?;`
    },

    AlterRenameItemsCopy: `ALTER TABLE ${ITEMS_COPY} RENAME TO ${ITEMS};`,

    CreateItemCols:
        `CREATE TABLE IF NOT EXISTS ${ITEM_COLS}` +
        ` (${ITEM_COL_ID} INTEGER PRIMARY KEY NOT NULL,` +
        ` ${ITEM_COL_NAME} TEXT,` +
        ` ${ITEM_COL_TITLE} TEXT,` +
        ` ${ITEM_COL_ISNOTE} BOOLEAN,` +
        ` ${ITEM_COL_ORDER} INTEGER);`,

    DropItems: `DROP TABLE IF EXISTS ${ITEMS};`,

    DropItemCols: `DROP TABLE IF EXISTS ${ITEM_COLS};`,

    InsertItemCol:
        `INSERT INTO ${ITEM_COLS} (${ITEM_COL_NAME},` +
        ` ${ITEM_COL_TITLE}, ${ITEM_COL_ISNOTE}, ${ITEM_COL_ORDER})` +
        ` VALUES (?, ?, ?, ?);`,

    PragmaTableInfoItems: `PRAGMA table_info(${ITEMS});`,

    SelectAllItemCols:
        `SELECT ${ITEM_COL_ID}, ${ITEM_COL_NAME},` +
        ` ${ITEM_COL_TITLE}, ${ITEM_COL_ISNOTE}, ${ITEM_COL_ORDER}` +
        ` FROM ${ITEM_COLS};`,

    SelectCountItemCols: `SELECT COUNT(1) AS count FROM ${ITEM_COLS};`,

    SelectCountItems: `SELECT COUNT(1) AS count FROM ${ITEMS};`,
}
