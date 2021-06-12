import * as FileSystem from 'expo-file-system'
import Papa from 'papaparse'
import { Alert } from 'react-native'
import { dbi } from '../../db/dbInstance'
import { FSConstants } from '../../fs/constants'
import { Strings } from '../../strings/strings'
import { updateFileSaved } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function saveFile() {
    return (dispatch: Dispatch, getState: GetState) => {
        dbi.getDataFromItems()
        .then((csvData) => {
            const csvString = Papa.unparse(csvData)
            return FileSystem.writeAsStringAsync(FSConstants.OutputFile, csvString)
        })
        .then(() => dispatch(updateFileSaved(true)))
        .catch((e) => {
            Alert.alert(Strings.Error, Strings.ItemUnexpectedError)
            dispatch(updateFileSaved(false))
        })
    }
}
