import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { FSConstants } from '../../fs/constants'
import { Strings } from '../../strings/strings'
import { updateFileSaved } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function shareSavedFile() {
    return async (dispatch: Dispatch, getState: GetState) => {
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert(Strings.Error, Strings.FileShareError)
            return
        }
        const showError = (message?: string) => {
            Alert.alert(Strings.Error, Strings.FileSavedError
                + message ? '\r\n\r\n' + message : '')
            dispatch(updateFileSaved(false))
        }
        try {
            await Sharing.shareAsync(FSConstants.OutputFile, {
                dialogTitle: Strings.FileShareDialogTitle,
                mimeType: FSConstants.CsvMimeType,
                UTI: FSConstants.CsvUti,
            })
        } catch (e) {
            showError(e.message)
        }
    }
}
