import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { getDBValues } from '../../forms/forms'
import { Dispatch, GetState } from '../shared/store'
import { Strings } from '../../strings/strings'
import { findItemById } from './findItemById'

export function saveNoteInput() {
    return (dispatch: Dispatch, getState: GetState) => {
        const { noteFields, noteInput, viewedItem } = getState()
        if (!viewedItem)
            return
        const values = getDBValues(noteInput, noteFields)
        dbi.updateItemById(viewedItem.id, noteFields, values)
        .then(() => {
            dispatch(findItemById(''+viewedItem.itemColumnValues[0]))
        })
        .catch((e) => Alert.alert(
            Strings.Error,
            Strings.ItemUnexpectedError + ' \r\n' + e.message
        ))
    }
}
