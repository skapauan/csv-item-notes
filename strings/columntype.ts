import { ColumnType } from '../db/types'
import { Strings } from './strings'

// Types must be kept in the same order in columnTypeStrings and columnTypeEnums
export const columnTypeStrings =
    [Strings.FieldTypeText, Strings.FieldTypeNumeric, Strings.FieldTypeBoolean]
export const columnTypeEnums =
    [ColumnType.Text, ColumnType.Numeric, ColumnType.Boolean]

export function getColumnTypeString(colType: ColumnType) {
    return columnTypeStrings[columnTypeEnums.indexOf(colType)]
}
