import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import Papa from 'papaparse'
import { updateDataStatus, updateOpenFileProgress, updateViewedError,
    updateViewedItem } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { dbi } from '../../db/dbInstance'
import { FSConstants } from '../../fs/constants'
import { getItemDataErrorMessage } from '../../strings/dberrors'
import { Strings } from '../../strings/strings'
import { getNoteFields } from './getNoteFields'

export type FileInfo = {
    document: DocumentPicker.DocumentResult;
    loadTime: number;
    rows: number;
}
export function openFile(
    success: (fileInfo: FileInfo) => void,
    showCancel: (message: string) => void,
    showError: (message: string) => void
) {
    return async (dispatch: Dispatch, getState: GetState) => {
        let document, csvString, csvData
        // Prompt user to choose CSV file
        try {
            document = await DocumentPicker.getDocumentAsync({
                type: FSConstants.CsvMimeType,
            })
        } catch (e) {
            showError(e.message)
            return
        }
        if (document.type !== 'success') {
            showCancel(Strings.LoadFileCanceled)
            return
        }
        // Show loading screen
        const timeStart = Date.now()
        const prevDataStatus = getState().dataStatus
        dispatch(updateOpenFileProgress(0))
        dispatch(updateDataStatus(-1))
        //TODO check device storage and/or enforce any file size limits here
        // Read CSV file as string
        try {
            csvString = await FileSystem.readAsStringAsync(document.uri)
        } catch (e) {
            showError(e.message)
            dispatch(updateDataStatus(prevDataStatus))
            dispatch(updateOpenFileProgress(-1))
            return
        }
        //TODO delete local file not needed anymore
        //TODO save file name, size, and last modified to database
        // Parse data and populate database
        csvData = Papa.parse<string[]>(csvString, { skipEmptyLines: true })
        try {
            await dbi.setItemsFromData(
                { rows: csvData.data, hasHeaderRow: true },
                (done, total) => dispatch(updateOpenFileProgress(done/total))
            )
        } catch (e) {
            try { await dbi.clearAll() } catch (err) {}
            showError(getItemDataErrorMessage(e))
            dispatch(updateDataStatus(0))
            dispatch(updateOpenFileProgress(-1))
            return
        }
        dispatch(getNoteFields())
        // Show file info and go to main app
        const timeEnd = Date.now()
        dispatch(updateViewedItem(undefined))
        dispatch(updateViewedError(''))
        dispatch(updateDataStatus(1))
        dispatch(updateOpenFileProgress(-1))
        success({
            document,
            loadTime: timeEnd - timeStart,
            rows: csvData.data.length,
        })
    }
}
