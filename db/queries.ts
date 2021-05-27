import { DBConstants } from './constants'

export const DBQueries = {
    
    getCreateItems: (columnDeclarations: string[]) => {
        const cols = [
            `${DBConstants.Items.Id} INTEGER PRIMARY KEY NOT NULL`,
            ...columnDeclarations
        ]
        return `CREATE TABLE IF NOT EXISTS
        ${DBConstants.Items.Table} (${cols.join(',')});`
    },
    
    getInsertItem: (columnNames: string[]): string => {
        const placeholders: string[] = []
        columnNames.forEach(() => placeholders.push('?'))
        return `INSERT INTO ${DBConstants.Items.Table}
        (${columnNames.join(',')}) VALUES (${placeholders.join(',')});`
    },

    getSelectTableWithName: (tableName: string) =>
        `SELECT name FROM sqlite_master WHERE type='table'
        AND name='${tableName.replace(/'/g, "''")}';`,

    getSelectTableIsEmpty: (tableName: string) =>
        `SELECT CASE WHEN EXISTS (SELECT 1 FROM
        "${tableName.replace(/"/g, '""')}") THEN 0 ELSE 1 END AS isempty;`,

    getSelectItemsWithColumnValue: (columnName: string, limitOne?: boolean) =>
        `SELECT * FROM ${DBConstants.Items.Table}
        WHERE "${columnName.replace(/"/g, '""')}" = ?
        ${limitOne ? 'LIMIT 1' : ''};`,

    getUpdateItemNotes: (columnNames: string[]): string => {
        const sets: string[] = []
        columnNames.forEach((columnName) => {
            sets.push(`"${columnName.replace(/"/g, '""')}" = ?`)
        })
        return `UPDATE ${DBConstants.Items.Table} SET ${sets.join(',')}
        WHERE "${DBConstants.Items.Id}" = ?`
    },

    CreateItemCols:
        `CREATE TABLE IF NOT EXISTS "${DBConstants.ItemCols.Table}" (
        ${DBConstants.ItemCols.Id} INTEGER PRIMARY KEY NOT NULL,
        ${DBConstants.ItemCols.Name} TEXT,
        ${DBConstants.ItemCols.Title} TEXT,
        ${DBConstants.ItemCols.IsNote} BOOLEAN);`,

    DropItems:
        `DROP TABLE IF EXISTS "${DBConstants.Items.Table}";`,

    DropItemCols:
        `DROP TABLE IF EXISTS "${DBConstants.ItemCols.Table}";`,
    
    InsertItemCol:
        `INSERT INTO "${DBConstants.ItemCols.Table}"
        (${DBConstants.ItemCols.Name}, ${DBConstants.ItemCols.Title},
        ${DBConstants.ItemCols.IsNote}) VALUES (?, ?, ?);`,

    SelectAllItemCols:
        `SELECT (${DBConstants.ItemCols.Name}, ${DBConstants.ItemCols.Title},
        ${DBConstants.ItemCols.IsNote}) FROM "${DBConstants.ItemCols.Table}";`,
    
    SelectItemsTableInfo:
        `SELECT (name, type) FROM PRAGMA_TABLE_INFO("${DBConstants.Items.Table}");`,
        
}
