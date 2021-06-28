import { dbi } from '../database/dbInstance'
import { ItemOutput } from '../database/types'
import {
    updateViewedEmptyId,
    updateViewedError,
    updateViewedItem,
} from '../redux/actions'
import { Dispatch, GetState, Thunk } from '../redux/store'
import { Strings } from '../strings/strings'

export function findItemById(firstValue?: string): Thunk {
    return async (dispatch: Dispatch, getState: GetState) => {
        let item: ItemOutput | undefined
        if (typeof firstValue !== 'string') {
            const { viewedItem, viewedEmptyId } = getState()
            if (viewedItem) firstValue = '' + viewedItem.itemColumnValues[0]
            else if (viewedEmptyId) firstValue = viewedEmptyId
            else return
        }
        firstValue = firstValue.trim()
        try {
            item = await dbi.findItemByFirstValue(firstValue)
        } catch (e) {
            dispatch(updateViewedEmptyId(''))
            dispatch(updateViewedError(Strings.ItemUnexpectedError))
            dispatch(updateViewedItem(undefined))
            return
        }
        if (!item) {
            dispatch(updateViewedEmptyId(firstValue))
            dispatch(updateViewedError(Strings.ItemNotFound))
            dispatch(updateViewedItem(undefined))
            return
        }
        dispatch(updateViewedEmptyId(''))
        dispatch(updateViewedError(''))
        dispatch(updateViewedItem(item))
    }
}
