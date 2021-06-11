import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { ItemColumn } from '../../db/types'
import { updateFieldEditStatus } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { Strings } from '../../strings/strings'
import { getNoteFields } from './getNoteFields'

export function modifyNoteField(field: ItemColumn) {
    return (dispatch: Dispatch, getState: GetState) => {
        const { id } = field
        if (typeof id !== 'number') {
            Alert.alert(Strings.Error, Strings.FieldModifyFailed)
            return
        }
        return dbi.updateNoteColumns([{...field, id }])
        .then(() => {
            dispatch(getNoteFields())
            dispatch(updateFieldEditStatus(false))
        })
        .catch((e) => Alert.alert(Strings.Error, e.message))
    }
}
