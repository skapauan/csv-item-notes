import * as FileSystem from 'expo-file-system'
import Papa from 'papaparse'
import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { FSConstants } from '../../fs/constants'
import { getId, getTempFile } from '../../fs/names'
import { Strings } from '../../strings/strings'
import { updateSaveFileId, updateSaveFileStatus } from '../shared/actions'
import { LoadingStatus } from '../shared/loadingStatus'
import { Dispatch, GetState } from '../shared/store'

export function saveFile(itemsWithNotesOnly: boolean = false) {
    return async (dispatch: Dispatch, getState: GetState) => {
        // Generate ID for this file save
        const id = getId()
        const tempFile = getTempFile(id)
        // Save file is in progress
        dispatch(updateSaveFileId(id))
        dispatch(updateSaveFileStatus(LoadingStatus.Loading))
        // Get data from database
        let csvData
        try {
            csvData = await dbi.getDataFromItems(itemsWithNotesOnly)
        } catch (e) {
            Alert.alert(Strings.Error, Strings.ErrorDatabase + e.message)
            dispatch(updateSaveFileId(-1))
            dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
            return
        }
        // Cancel if user navigated away
        if (getState().saveFileId !== id)
            return
        // Convert data into CSV string
        const numRows = csvData.length
        const csvString = Papa.unparse(csvData)
        // Write CSV to filesystem
        try {
            await FileSystem.writeAsStringAsync(tempFile, csvString)
        } catch (e) {
            Alert.alert(Strings.Error, Strings.ErrorFileSystem + e.message)
            dispatch(updateSaveFileId(-1))
            dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
            return
        }
        // Cancel if user navigated away (last chance!)
        if (getState().saveFileId !== id) {
            try {
                await FileSystem.deleteAsync(tempFile)
            } catch (e) {}
            return
        }
        // Move file to final location
        try {
            await FileSystem.deleteAsync(FSConstants.OutputFile)
            await FileSystem.moveAsync(
                { from: tempFile, to: FSConstants.OutputFile})
        } catch (e) {
            Alert.alert(Strings.Error, Strings.ErrorFileSystem + e.message)
            dispatch(updateSaveFileId(-1))
            dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
            return
        }
        // Save file is complete
        if (itemsWithNotesOnly && numRows < 2) {
            Alert.alert('', Strings.SaveThereAreNoNotes)
        }
        dispatch(updateSaveFileId(-1))
        dispatch(updateSaveFileStatus(LoadingStatus.Done))
    }
}
