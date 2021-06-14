import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { ItemColumn } from '../../db/types'
import { updateFieldEditStatus } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { Strings } from '../../strings/strings'
import { findItemById } from './findItemById'
import { getNoteFields } from './getNoteFields'

export function deleteNoteField(field: ItemColumn) {
    return (dispatch: Dispatch, getState: GetState) => {
        const { id } = field
        if (typeof id !== 'number') {
            Alert.alert(Strings.Error, Strings.FieldDeleteFailed)
            return
        }
        dbi.removeNoteColumns([{ id }])
        .then(() => {
            dispatch(getNoteFields())
            dispatch(findItemById())
            dispatch(updateFieldEditStatus(false))
        })
        .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}