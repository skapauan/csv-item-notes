import { dbi } from '../../db/dbInstance'
import { ItemOutput } from '../../db/types'
import { Strings } from '../../strings/strings'
import { updateViewedItem, updateViewedError } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function findItemById(id: string) {
    return async (dispatch: Dispatch, getState: GetState) => {
        let item: ItemOutput | undefined
        try {
            item = await dbi.findItemByFirstValue(id)
        } catch (e) {
            dispatch(updateViewedError(Strings.ItemUnexpectedError))
            return
        }
        if (!item) {
            dispatch(updateViewedError(Strings.ItemNotFound))
            return
        }
        dispatch(updateViewedError(''))
        dispatch(updateViewedItem(item))
    }
}
