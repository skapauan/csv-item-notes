import { DBConstants } from './constants'
import { ColumnType, DBQuery, DBValue, EditNoteInput } from './types'

export const DBQueries = {

    getAlterItemsAddColumn: (columnName: string, columnType: ColumnType) =>
        `ALTER TABLE ${DBConstants.Items.Table}
        ADD COLUMN ${columnName} ${columnType};`,
    
    getCreateItems: (columnDeclarations: string[], isCopy: boolean = false)
    : string => {
        const cols = [
            `${DBConstants.Items.Id} INTEGER PRIMARY KEY NOT NULL`,
            ...columnDeclarations
        ]
        const table = isCopy
            ? DBConstants.Items.TableCopy
            : DBConstants.Items.Table
        return `CREATE TABLE IF NOT EXISTS ${table} (${cols.join(',')});`
    },

    getDeleteItemColById: (id: number): DBQuery => ({
        text: `DELETE FROM ${DBConstants.ItemCols.Table}
            WHERE ${DBConstants.ItemCols.Id} = ?;`,
        values: [id],
    }),
    
    getInsertItem: (columnNames: string[]): string => {
        const placeholders: string[] = []
        columnNames.forEach(() => placeholders.push('?'))
        return `INSERT INTO ${DBConstants.Items.Table}
        (${columnNames.join(',')}) VALUES (${placeholders.join(',')});`
    },

    getInsertItemsCopy: (columnNames: string[]): DBQuery => {
        const colNamesString = columnNames.join(',')
        return `INSERT INTO ${DBConstants.Items.TableCopy}
        (${colNamesString})
        SELECT ${colNamesString}
        FROM ${DBConstants.Items.Table};`
    },

    getSelectAllItems: (selectColumnNames?: string[],
    notNullColNames?: string[]) : DBQuery => {
        let cols = '*'
        if (selectColumnNames && selectColumnNames.length > 0) {
            cols = selectColumnNames.join(',')
        }
        if (notNullColNames && notNullColNames.length > 0) {
            const conditions = notNullColNames
                .map(name => `${name} IS NOT NULL`)
                .join(' OR ')
            return `SELECT ${cols} FROM ${DBConstants.Items.Table}
            WHERE ${conditions};`
        }
        return `SELECT ${cols} FROM ${DBConstants.Items.Table};`
    },

    getSelectTableWithName: (tableName: string) =>
        `SELECT name FROM sqlite_master WHERE type='table'
        AND name='${tableName.replace(/'/g, "''")}';`,

    getSelectTableIsEmpty: (tableName: string) =>
        `SELECT CASE WHEN EXISTS (SELECT 1 FROM
        "${tableName.replace(/"/g, '""')}") THEN 0 ELSE 1 END AS isempty;`,

    getSelectItemsWithColumnValue: (columnName: string,
    selectColumnNames?: string[], limitOne?: boolean): string => {
        let cols = '*'
        if (selectColumnNames && selectColumnNames.length > 0) {
            cols = selectColumnNames.join(',')
        }
        return `SELECT ${cols} FROM ${DBConstants.Items.Table}
        WHERE "${columnName.replace(/"/g, '""')}" = ?
        ${limitOne ? 'LIMIT 1' : ''};`
    },

    getUpdateItemCol: ({ id, title, order }: EditNoteInput)
    : DBQuery | undefined => {
        const sets: string[] = []
        const values: DBValue[] = []
        if (typeof title === 'string') {
            sets.push(`${DBConstants.ItemCols.Title} = ?`)
            values.push(title)
        }
        if (typeof order === 'number') {
            sets.push(`${DBConstants.ItemCols.Order} = ?`)
            values.push(order)
        }
        if (sets.length < 1) return
        values.push(id)
        return {
            text: `UPDATE ${DBConstants.ItemCols.Table}
                SET ${sets.join(',')}
                WHERE ${DBConstants.ItemCols.Id} = ?;`,
            values,
        }
    },

    getUpdateItemById: (columnNames: string[]): string => {
        const sets: string[] = []
        columnNames.forEach((columnName) => {
            sets.push(`"${columnName.replace(/"/g, '""')}" = ?`)
        })
        return `UPDATE ${DBConstants.Items.Table} SET ${sets.join(',')}
        WHERE "${DBConstants.Items.Id}" = ?`
    },

    AlterRenameItemsCopy:
        `ALTER TABLE ${DBConstants.Items.TableCopy}
        RENAME TO ${DBConstants.Items.Table};`,

    CreateItemCols:
        `CREATE TABLE IF NOT EXISTS "${DBConstants.ItemCols.Table}" (
        ${DBConstants.ItemCols.Id} INTEGER PRIMARY KEY NOT NULL,
        ${DBConstants.ItemCols.Name} TEXT,
        ${DBConstants.ItemCols.Title} TEXT,
        ${DBConstants.ItemCols.IsNote} BOOLEAN,
        ${DBConstants.ItemCols.Order} INTEGER);`,

    DropItems:
        `DROP TABLE IF EXISTS "${DBConstants.Items.Table}";`,

    DropItemCols:
        `DROP TABLE IF EXISTS "${DBConstants.ItemCols.Table}";`,

    InsertItemCol:
        `INSERT INTO "${DBConstants.ItemCols.Table}"
        (${DBConstants.ItemCols.Name}, ${DBConstants.ItemCols.Title},
        ${DBConstants.ItemCols.IsNote}, ${DBConstants.ItemCols.Order})
        VALUES (?, ?, ?, ?);`,

    PragmaTableInfoItems:
        `PRAGMA table_info("${DBConstants.Items.Table}");`,

    SelectAllItemCols:
        `SELECT ${DBConstants.ItemCols.Id}, ${DBConstants.ItemCols.Name},
        ${DBConstants.ItemCols.Title}, ${DBConstants.ItemCols.IsNote},
        ${DBConstants.ItemCols.Order} FROM "${DBConstants.ItemCols.Table}";`,

    SelectCountItemCols: 'SELECT COUNT(1) AS count FROM item_cols;',

    SelectCountItems: 'SELECT COUNT(1) AS count FROM items;',

}
