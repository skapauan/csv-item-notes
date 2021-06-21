import { Alert } from 'react-native'
import { dbi } from '../database/dbInstance'
import { getDBValues } from '../forms/forms'
import { Dispatch, GetState } from '../redux/store'
import { Strings } from '../strings/strings'
import { findItemById } from './findItemById'

export function saveNoteInput() {
    return (dispatch: Dispatch, getState: GetState) => {
        const { noteFields, noteInput, viewedItem } = getState()
        if (!viewedItem)
            return
        const values = getDBValues(noteInput, noteFields)
        dbi.updateItemById(viewedItem.id, noteFields, values)
        .then(() => {
            dispatch(findItemById())
        })
        .catch((e) => Alert.alert(
            Strings.Error,
            Strings.ItemUnexpectedError + ' \r\n' + e.message
        ))
    }
}
