import { Alert } from 'react-native'
import { dbi } from '../database/dbInstance'
import { ItemColumn } from '../database/types'
import { updateFieldEdit } from '../redux/actions'
import { Dispatch, Thunk } from '../redux/store'
import { Strings } from '../strings/strings'
import { findItemById } from './findItemById'
import { getNoteFields } from './getNoteFields'

export function deleteNoteField(field: ItemColumn): Thunk {
    return (dispatch: Dispatch) => {
        const { id } = field
        if (typeof id !== 'number') {
            Alert.alert(Strings.Error, Strings.FieldDeleteFailed)
            return
        }
        dbi.removeNoteColumns([{ id }])
            .then(() => {
                dispatch(getNoteFields())
                dispatch(findItemById())
                dispatch(updateFieldEdit(false))
            })
            .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
