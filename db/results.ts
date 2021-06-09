import { SQLResultSet } from 'expo-sqlite'
import { ColumnTypes, DBValue, ItemColumn, ItemsRow } from './types'

export function getItemColumnValues(
    result: SQLResultSet,
    itemColumns: ItemColumn[]
): DBValue[][] {
    const output: DBValue[][] = []
    if (result.rows.length > 0) {
        const icl = itemColumns.length
        for (let i = 0, row: ItemsRow; !!(row = result.rows.item(i)); i++) {
            const valueRow: DBValue[] = []
            for (let j = 0; j < icl; j++) {
                const col = itemColumns[j]
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
