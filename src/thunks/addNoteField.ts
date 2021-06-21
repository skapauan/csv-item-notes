import { Alert } from 'react-native'
import { dbi } from '../database/dbInstance'
import { CreateNoteInput } from '../database/types'
import { updateFieldEditStatus } from '../redux/actions'
import { Dispatch, GetState } from '../redux/store'
import { Strings } from '../strings/strings'
import { findItemById } from './findItemById'
import { getNoteFields } from './getNoteFields'

export function addNoteField(field: CreateNoteInput) {
    return (dispatch: Dispatch, getState: GetState) => {
        let { title, type } = field
        title = title.trim()
        if (!title) {
            const { noteFields } = getState()
            title = Strings.FieldDefaultTitle + (noteFields.length + 1)
        }
        return dbi.createNoteColumns([{ title, type }])
        .then(() => {
            dispatch(getNoteFields())
            dispatch(findItemById())
            dispatch(updateFieldEditStatus(false))
        })
        .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
