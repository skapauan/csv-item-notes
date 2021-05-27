export const DBConstants = {
    Database: 'csv_item_notes',
    CsvNotePrefix: 'CsvItemNote_',
    CsvNoteTypeSuffix: '_',
    Items: {
        Table: 'items',
        Id: 'item_id',
        DataPrefix: 'data_',
        NotePrefix: 'note_',
    },
    ItemCols: {
        Table: 'item_cols',
        Id: 'item_col_id',
        Name: 'name',
        Title: 'title',
        IsNote: 'is_note',
    },
}

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

export type DBValue = string | number | boolean | null
