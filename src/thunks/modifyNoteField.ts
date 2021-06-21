import { Alert } from 'react-native'
import { dbi } from '../database/dbInstance'
import { ItemColumn } from '../database/types'
import { updateFieldEditStatus } from '../redux/actions'
import { Dispatch, GetState } from '../redux/store'
import { Strings } from '../strings/strings'
import { getNoteFields } from './getNoteFields'

export function modifyNoteField(field: ItemColumn) {
    return (dispatch: Dispatch, getState: GetState) => {
        let { id, title } = field
        if (typeof id !== 'number') {
            Alert.alert(Strings.Error, Strings.FieldModifyFailed)
            return
        }
        if (!title) {
            const { noteFields } = getState()
            title = Strings.FieldDefaultTitle + noteFields.length
        }
        return dbi.updateNoteColumns([{...field, id, title }])
        .then(() => {
            dispatch(getNoteFields())
            dispatch(updateFieldEditStatus(false))
        })
        .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
