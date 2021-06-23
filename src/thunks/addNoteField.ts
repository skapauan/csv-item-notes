import { Alert } from 'react-native'
import { dbi } from '../database/dbInstance'
import { CreateNoteInput } from '../database/types'
import { updateFieldEdit } from '../redux/actions'
import { Dispatch, GetState, Thunk } from '../redux/store'
import { Strings } from '../strings/strings'
import { findItemById } from './findItemById'
import { getNoteFields } from './getNoteFields'

export function addNoteField(field: CreateNoteInput): Thunk {
    return (dispatch: Dispatch, getState: GetState) => {
        const { type } = field
        let { title } = field
        title = title.trim()
        if (!title) {
            const { noteFields } = getState()
            title = Strings.FieldDefaultTitle + (noteFields.length + 1)
        }
        return dbi
            .createNoteColumns([{ title, type }])
            .then(() => {
                dispatch(getNoteFields())
                dispatch(findItemById())
                dispatch(updateFieldEdit(false))
            })
            .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
