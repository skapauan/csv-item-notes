
export type DBValue = string | number | boolean | null
export type DBQuery = string | { text: string, values: DBValue[] }
export type NotesInput = { colName: string, value: DBValue }[]
export type ItemDataInput = { rows: string[][], hasHeaderRow?: boolean }
export type ItemColumn = {
    id?: number;
    index: number;
    name: string;
    type: ColumnType;
    title?: string;
    isNote?: boolean;
    order?: number;
}
export type CreateNoteInput = {
    title: string;
    type: ColumnType;
}
export type EditNoteInput = {
    id: number;
    title?: string;
    order?: number;
}
export type ItemsRow = { [name: string]: DBValue }
export type ItemColsRow = {
    'item_col_id': number;
    'name': string;
    'title': string;
    'is_note': number;
    'note_order': number | null;
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
