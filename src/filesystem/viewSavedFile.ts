import { Alert, Platform } from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import { Strings } from '../strings/strings'
import { FSConstants } from './constants'

export async function viewSavedFile(
    uri: string,
    isContentUri: boolean,
): Promise<void> {
    if (Platform.OS !== 'android') return

    const showFileError = (message?: string) => {
        Alert.alert(
            Strings.Error,
            Strings.FileSavedError + message ? '\r\n\r\n' + message : '',
        )
    }
    let contentUri
    if (isContentUri) {
        contentUri = uri
    } else {
        try {
            contentUri = await FileSystem.getContentUriAsync(uri)
        } catch (e) {
            showFileError(e.message)
            return
        }
    }
    if (!contentUri) {
        showFileError()
        return
    }

    try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1,
            type: FSConstants.CsvMimeType,
        })
    } catch (e) {
        Alert.alert(Strings.Error, Strings.FileViewFailedError)
    }
}
