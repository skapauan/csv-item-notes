import { dbi } from '../database/dbInstance'
import { updateDataStatus } from '../redux/actions'
import { LoadingStatus } from '../redux/loadingStatus'
import { Dispatch, Thunk } from '../redux/store'
import { getNoteFields } from './getNoteFields'

export function checkDataStatus(): Thunk {
    return (dispatch: Dispatch) => {
        dbi.init()
            .then(() => {
                dispatch(getNoteFields())
                dispatch(updateDataStatus(LoadingStatus.Done))
            })
            .catch(() => dispatch(updateDataStatus(LoadingStatus.Unstarted)))
    }
}
