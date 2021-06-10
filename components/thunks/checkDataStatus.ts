import { dbi } from '../../db/dbInstance'
import { updateDataStatus } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { getNoteFields } from './getNoteFields'

export function checkDataStatus() {
    return (dispatch: Dispatch, getState: GetState) => {
        dbi.init()
        .then(() => {
            dispatch(getNoteFields())
            dispatch(updateDataStatus(1))
        })
        .catch((e) => dispatch(updateDataStatus(0)))
    }
}
