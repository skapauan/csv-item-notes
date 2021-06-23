import { ColumnType, DBValue, ItemColumn } from '../database/types'

export type FormValue = string | boolean

export function getDbValue(formValue: FormValue, type: ColumnType): DBValue {
    switch (type) {
        case ColumnType.Boolean:
            return formValue ? true : null
        case ColumnType.Numeric:
            let num: number | null = null
            if (typeof formValue === 'string') {
                num = parseFloat(formValue)
                if (isNaN(num)) num = null
            }
            return num
        case ColumnType.Text:
            let str: string | null = null
            if (typeof formValue === 'string') {
                str = formValue.trim()
                if (str.length < 1) str = null
            }
            return str
        default:
            // should never reach here
            return null
    }
}

export function getDBValues(
    formValues: FormValue[],
    columns: ItemColumn[],
): DBValue[] {
    const dbValues: DBValue[] = []
    formValues.forEach((value, index) => {
        dbValues.push(getDbValue(value, columns[index].type))
    })
    return dbValues
}

export function getFormValue(dbValue: DBValue, type: ColumnType): FormValue {
    switch (type) {
        case ColumnType.Boolean:
            return !!dbValue
        case ColumnType.Numeric:
            return typeof dbValue === 'number' ? '' + dbValue : ''
        case ColumnType.Text:
            return typeof dbValue === 'string' ? dbValue : ''
        default:
            // should never reach here
            return ''
    }
}

export function getFormValues(
    dbValues: DBValue[],
    columns: ItemColumn[],
): FormValue[] {
    const formValues: FormValue[] = []
    dbValues.forEach((value, index) => {
        formValues.push(getFormValue(value, columns[index].type))
    })
    return formValues
}
