import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import Papa from 'papaparse'
import { updateDataStatus, updateViewedError, updateViewedItem } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'
import { dbi } from '../../db/dbInstance'
import { getItemDataErrorMessage } from '../../strings/dberrors'
import { Strings } from '../../strings/strings'

export type FileInfo = {
    document: DocumentPicker.DocumentResult;
    loadTime: number;
    rows: number;
}
export function openFile(
    showError: (errorMessage: string) => void,
    success: (fileInfo: FileInfo) => void
) {
    return async (dispatch: Dispatch, getState: GetState) => {
        let document, csvString, csvData
        try {
            document = await DocumentPicker.getDocumentAsync({
                type: 'text/comma-separated-values',
            })
        } catch (e) {
            showError(e.message)
            return
        }
        if (document.type !== 'success') {
            return Promise.reject(new Error(Strings.LoadFileCanceled))
        }
        const timeStart = Date.now()
        dispatch(updateDataStatus(-1))
        //TODO check device storage and/or enforce any file size limits here
        try {
            csvString = await FileSystem.readAsStringAsync(document.uri)
        } catch (e) {
            showError(e.message)
            return
        }
        //TODO delete local files not needed anymore
        csvData = Papa.parse<string[]>(csvString, { skipEmptyLines: true })
        try {
            await dbi.setItemsFromData(
                { rows: csvData.data, hasHeaderRow: true })
        } catch (e) {
            showError(getItemDataErrorMessage(e))
            dispatch(updateDataStatus(0))
            return
        }
        const timeEnd = Date.now()
        dispatch(updateViewedItem(undefined))
        dispatch(updateViewedError(''))
        dispatch(updateDataStatus(1))
        success({
            document,
            loadTime: timeEnd - timeStart,
            rows: csvData.data.length,
        })
    }
}
