import { dbi } from '../database/dbInstance'
import { updateDataFields } from '../redux/actions'
import { Dispatch, Thunk } from '../redux/store'

export function getDataFields(): Thunk {
    return (dispatch: Dispatch) => {
        const dataFields = dbi.itemColumns.filter(({ isNote }) => !isNote)
        dispatch(updateDataFields(dataFields))
    }
}
