import * as FileSystem from 'expo-file-system'
import { StorageAccessFramework } from 'expo-file-system'
import Papa from 'papaparse'
import { Alert, Platform } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { FSConstants } from '../../fs/constants'
import { createCacheDirectory } from '../../fs/createCacheDirectory'
import { getInternalUri, sanitizeFileName } from '../../fs/names'
import { Strings } from '../../strings/strings'
import { updateSaveFileStatus, updateSaveExternalUri, updateSaveInternalUri }
    from '../shared/actions'
import { LoadingStatus } from '../shared/loadingStatus'
import { Dispatch, GetState } from '../shared/store'

export function saveFile(fileName: string, itemsWithNotesOnly: boolean = false) {
    return async (dispatch: Dispatch, getState: GetState) => {

        let willWarnNoNotes = false
        const warnNoNotes = () => {
            if (itemsWithNotesOnly && numRows < 2) {
                Alert.alert('', Strings.SaveThereAreNoNotes)
            }
        }

        // Sanitize file name
        fileName = sanitizeFileName(fileName)

        // Save file is in progress
        dispatch(updateSaveFileStatus(LoadingStatus.Loading))
        dispatch(updateSaveExternalUri(''))
        dispatch(updateSaveInternalUri(''))

        // Get data from database
        let csvData
        try {
            csvData = await dbi.getDataFromItems(itemsWithNotesOnly)
        } catch (e) {
            Alert.alert(Strings.Error, Strings.ErrorDatabase + e.message)
            dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
            return
        }

        // Convert data into CSV string
        const numRows = csvData.length
        const csvString = Papa.unparse(csvData)

        // Write CSV to app's cache directory
        const internalUri = getInternalUri(fileName)
        try {
            await createCacheDirectory()
            await FileSystem.writeAsStringAsync(internalUri, csvString)
        } catch (e) {
            Alert.alert(Strings.Error, Strings.ErrorFileSystem + e.message)
            dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
            dispatch(updateSaveInternalUri(''))
            dispatch(updateSaveExternalUri(''))
            return
        }
        dispatch(updateSaveInternalUri(internalUri))

        // Write CSV to external directory of user's choice
        let externalUri = ''
        if (Platform.OS === 'android') {
            const dirUri = StorageAccessFramework.getUriForDirectoryInRoot(
                FSConstants.DownloadFolder)
            const dirPerm = await (StorageAccessFramework
                .requestDirectoryPermissionsAsync(dirUri))
            if (dirPerm.granted) {
                try {
                    externalUri = await StorageAccessFramework.createFileAsync(
                        dirPerm.directoryUri, fileName, FSConstants.CsvMimeType)
                    await FileSystem.writeAsStringAsync(externalUri, csvString)
                } catch (e) {
                    willWarnNoNotes = true
                    Alert.alert(
                        Strings.Warning,
                        Strings.SaveWriteFileWarn + e.message,
                        [{ onPress: warnNoNotes }],
                        { onDismiss: warnNoNotes }
                    )
                }
            } else {
                willWarnNoNotes = true
                Alert.alert(
                    Strings.Warning,
                    Strings.SaveDirectoryPermissionWarn,
                    [{ onPress: warnNoNotes }],
                    { onDismiss: warnNoNotes }
                )
            }
        }
        dispatch(updateSaveExternalUri(externalUri))

        // Save file is complete
        if (!willWarnNoNotes) warnNoNotes()
        dispatch(updateSaveFileStatus(LoadingStatus.Done))

    }
}
