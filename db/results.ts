import { SQLResultSet } from 'expo-sqlite'
import { ColumnTypes, ItemColumn, ItemOutput, ItemsRow } from './types'

export function getItemOutputs(
    result: SQLResultSet,
    itemColumns: ItemColumn[]
): ItemOutput[] {
    const output: ItemOutput[] = []
    for (let i = 0, row: ItemsRow; !!(row = result.rows.item(i)); i++) {
        const id = row.item_id
        const itemColumnValues = itemColumns.map(({ name, type }) => {
            let value = row[name]
            if (typeof value === 'undefined')
                return null
            if (type === ColumnTypes.Boolean)
                return value === 1 ? true : null
            return value
        })
        output.push({ id, itemColumnValues })
    }
    return output
}

export function isTruthyValue(value: any): boolean {
    if (typeof value === 'string') {
        const str = value.trim().toLowerCase()
        if (!str) return false
        if (str === 'false' || str === '0' || str === 'no') return false
        return true
    }
    return !!value
}
