import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import { Alert } from 'react-native'
import { FSConstants } from '../../fs/constants'
import { Strings } from '../../strings/strings'
import { Dispatch, GetState } from '../shared/store'

export function viewSavedFile() {
    return (dispatch: Dispatch, getState: GetState) => {
        const showError = (message?: string) => {
            Alert.alert(Strings.Error, Strings.FileSavedError
                + message ? '\r\n\r\n' + message : '')
        }
        FileSystem.getContentUriAsync(FSConstants.OutputFile)
        .then((contentUri) => {
            if (!contentUri) {
                showError()
                return
            }
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                flags: 1,
                type: FSConstants.CsvMimeType,
            })
        })
        .catch((e) => showError(e.message))
    }
}
