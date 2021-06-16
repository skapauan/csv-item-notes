import { dbi } from '../../db/dbInstance'
import { updateDataStatus } from '../shared/actions'
import { LoadingStatus } from '../shared/loadingStatus'
import { Dispatch, GetState } from '../shared/store'
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
