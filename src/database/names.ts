import { DBConstants } from './constants'
import { ItemColumn } from './types'

export const getDataColName = (index: number): string =>
    DBConstants.Items.DataPrefix + index

export const getNoteColName = (index: number): string =>
    DBConstants.Items.NotePrefix + index

export const getColNumber = (name: string): number | undefined => {
    let str: string
    if (name.startsWith(DBConstants.Items.DataPrefix))
        str = name.slice(DBConstants.Items.DataPrefix.length)
    else if (name.startsWith(DBConstants.Items.NotePrefix))
        str = name.slice(DBConstants.Items.NotePrefix.length)
    else return
    const num = parseInt(str)
    if (isNaN(num)) return
    return num
}

export const getLastColNumber = (itemColumns: ItemColumn[]): number => {
    const len = itemColumns.length
    let maxNum = Number.NEGATIVE_INFINITY
    for (let i = 0; i < len; i++) {
        const num = getColNumber(itemColumns[i].name)
        if (typeof num === 'number' && num > maxNum) maxNum = num
    }
    if (maxNum === Number.NEGATIVE_INFINITY) return 0
    return maxNum
}

export const getLastOrder = (itemColumns: ItemColumn[]): number => {
    const len = itemColumns.length
    let maxOrd = Number.NEGATIVE_INFINITY
    for (let i = 0; i < len; i++) {
        const ord = itemColumns[i].order
        if (typeof ord === 'number' && ord > maxOrd) maxOrd = ord
    }
    if (maxOrd === Number.NEGATIVE_INFINITY) return -1
    return maxOrd
}
