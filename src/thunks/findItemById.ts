import { dbi } from '../database/dbInstance'
import { ItemOutput } from '../database/types'
import { updateViewedError, updateViewedItem } from '../redux/actions'
import { Dispatch, GetState, Thunk } from '../redux/store'
import { Strings } from '../strings/strings'

export function findItemById(firstValue?: string): Thunk {
    return async (dispatch: Dispatch, getState: GetState) => {
        let item: ItemOutput | undefined
        if (typeof firstValue !== 'string') {
            const { viewedItem } = getState()
            if (!viewedItem) return
            firstValue = '' + viewedItem.itemColumnValues[0]
        }
        try {
            item = await dbi.findItemByFirstValue(firstValue)
        } catch (e) {
            dispatch(updateViewedError(Strings.ItemUnexpectedError))
            dispatch(updateViewedItem(undefined))
            return
        }
        if (!item) {
            dispatch(updateViewedError(Strings.ItemNotFound))
            dispatch(updateViewedItem(undefined))
            return
        }
        dispatch(updateViewedError(''))
        dispatch(updateViewedItem(item))
    }
}
