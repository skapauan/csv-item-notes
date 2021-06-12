import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import Papa from 'papaparse'
import { FSConstants } from '../../fs/constants'
import { updateFileSaved } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function saveFile() {
    return (dispatch: Dispatch, getState: GetState) => {
        //TODO get rows of DB, process into required data format, and unparse into CSV string
        const contents = 'A,B,C\r\n1,2,3\r\nabc,123,you and me'
        console.log(FSConstants.OutputFile)
        FileSystem.writeAsStringAsync(FSConstants.OutputFile, contents)
        .then(() => dispatch(updateFileSaved(true)))
    }
}
