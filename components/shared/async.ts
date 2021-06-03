
// Use Redux thunk format for async operations

import Papa from 'papaparse'
import { dbi } from '../../db/dbInstance'
import { pickFileGetString } from '../../fs/fs'
import { getItemDataErrorMessage } from '../../strings/dberrors'
import { Strings } from '../../strings/strings'
import { updateDataStatus, updateViewedItem, updateViewedError } from './actions'
import { Dispatch, GetState } from './store'

export function checkDataStatus() {
    return (dispatch: Dispatch, getState: GetState) => {
        dbi.init()
        .then(() => dispatch(updateDataStatus(1)))
        .catch((e) => dispatch(updateDataStatus(0)))
    }
}

export function openFile(showError: (m: string) => void, success: () => void) {
    return async (dispatch: Dispatch, getState: GetState) => {
        let csvString, csvData
        try {
            csvString = await pickFileGetString({
                type: 'text/comma-separated-values',
            })
        } catch (e) {
            showError(e.message)
            return
        }
        csvData = Papa.parse<string[]>(csvString, { skipEmptyLines: true })
        dispatch(updateDataStatus(-1))
        try {
            await dbi.setItemsFromData({
                rows: csvData.data,
                hasHeaderRow: true,
            })
        } catch (e) {
            showError(getItemDataErrorMessage(e))
            dispatch(updateDataStatus(0))
            return
        }
        dispatch(updateViewedItem(undefined))
        dispatch(updateViewedError(''))
        dispatch(updateDataStatus(1))
        success()
    }
}

export function findItemById(id: string) {
    return async (dispatch: Dispatch, getState: GetState) => {
        let item
        try {
            item = await dbi.findItemByFirstDataValue(id)
        } catch (e) {
            dispatch(updateViewedError(Strings.ItemUnexpectedError))
            return
        }
        if (!item) {
            dispatch(updateViewedError(Strings.ItemNotFound))
            return
        }
        dispatch(updateViewedError(''))
        dispatch(updateViewedItem(item))
    }
}
