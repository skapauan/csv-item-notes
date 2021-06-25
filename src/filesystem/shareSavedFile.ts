import { Alert } from 'react-native'
import * as Sharing from 'expo-sharing'
import { Strings } from '../strings/strings'
import { FSConstants } from './constants'

export async function shareSavedFile(fileUri: string): Promise<void> {
    if (!fileUri) {
        Alert.alert(Strings.Error, Strings.FileSavedError)
        return
    }

    if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(Strings.Error, Strings.FileShareUnavailableError)
        return
    }

    try {
        await Sharing.shareAsync(fileUri, {
            dialogTitle: Strings.FileShareDialogTitle,
            mimeType: FSConstants.CsvMimeType,
            UTI: FSConstants.CsvUti,
        })
    } catch (e) {
        Alert.alert(Strings.Error, Strings.FileShareFailedError + e.message)
    }
}
