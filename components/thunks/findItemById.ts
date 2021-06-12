import { dbi } from '../../db/dbInstance'
import { ItemOutput } from '../../db/types'
import { Strings } from '../../strings/strings'
import { updateViewedItem, updateViewedError } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function findItemById(firstValue?: string) {
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
