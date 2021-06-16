import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { FSConstants } from '../../fs/constants'
import { Strings } from '../../strings/strings'
import { Dispatch, GetState } from '../shared/store'

export function shareSavedFile() {
    return async (dispatch: Dispatch, getState: GetState) => {
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert(Strings.Error, Strings.FileShareUnavailableError)
            return
        }
        try {
            await Sharing.shareAsync(FSConstants.OutputFile, {
                dialogTitle: Strings.FileShareDialogTitle,
                mimeType: FSConstants.CsvMimeType,
                UTI: FSConstants.CsvUti,
            })
        } catch (e) {
            Alert.alert(Strings.Error, Strings.FileShareFailedError
                + e?.message)
        }
    }
}
