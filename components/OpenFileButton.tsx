import React from 'react'
import { Alert, View } from 'react-native'
import { Button } from 'react-native-elements'
import Papa from 'papaparse'
import { dbi } from '../db/dbInstance'
import { pickFileGetString } from '../fs/fs'
import { Strings } from '../strings/strings'
import { getItemDataErrorMessage } from '../strings/dberrors'
import { Context } from './Context'

export function OpenFileButton() {
    return (
        <Context.Consumer>
        {({ dataStatus, setDataStatus}) => {
            const openFile = async () => {
                let csvString, csvData
                try {
                    csvString = await pickFileGetString({type: 'text/comma-separated-values'})
                    console.log(csvString)
                } catch (e) {
                    Alert.alert(e.message)
                    return
                }
                csvData = Papa.parse<string[]>(csvString)
                try {
                    await dbi.setItemsFromData({rows: csvData.data, hasHeaderRow: true})
                    setDataStatus(1)
                    Alert.alert(Strings.DoneLoadingFile)
                } catch (e) {
                    Alert.alert(getItemDataErrorMessage(e))
                }
            }
            return (<Button title={Strings.OpenFileButton} onPress={openFile} />)
        }}
        </Context.Consumer>
    )
}
