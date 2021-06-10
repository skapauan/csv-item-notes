import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { CreateNoteInput } from '../../db/types'
import { updateFieldEditStatus } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { Strings } from '../../strings/strings'
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
            dispatch(updateFieldEditStatus(false))
        })
        .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
