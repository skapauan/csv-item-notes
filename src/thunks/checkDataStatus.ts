import { dbi } from '../database/dbInstance'
import { updateDataStatus } from '../redux/actions'
import { LoadingStatus } from '../redux/loadingStatus'
import { Dispatch, GetState } from '../redux/store'
import { getNoteFields } from './getNoteFields'

export function checkDataStatus() {
    return (dispatch: Dispatch, getState: GetState) => {
        dbi.init()
        .then(() => {
            dispatch(getNoteFields())
            dispatch(updateDataStatus(LoadingStatus.Done))
        })
        .catch((e) => dispatch(updateDataStatus(LoadingStatus.Unstarted)))
    }
}
