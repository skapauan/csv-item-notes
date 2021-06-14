import React from 'react'
import { Alert, ToastAndroid } from 'react-native'
import { Button } from 'react-native-elements'
import { dbi } from '../db/dbInstance'
import { FileInfo, openFile } from './thunks/openFile'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'

export interface OpenFileButtonProps { navigation?: any; }

export function OpenFileButton({ navigation }: OpenFileButtonProps) {
    const { dispatch } = React.useContext(StoreContext)

    const showError = (message: string) => {
        Alert.alert(Strings.LoadFileError, message)
    }
    const showCancel = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.SHORT)
    }
    const success = (fileInfo: FileInfo) => {
        const { loadTime, rows } = fileInfo
        const document = fileInfo.document as any // make ts compiler happy
        Alert.alert(
            Strings.LoadFileDone,
            Strings.LoadFileInfo
                .replace('%', '' + document.name)
                .replace('%', '' + document.size)
                .replace('%', '' + rows)
                .replace('%', '' + (loadTime / 1000))
        )
        if (navigation) {
            navigation.navigate(Strings.ScreenNameView)
        }
    }

    const fileOpen = () => dispatch(openFile(success, showCancel, showError))
    let onPress
    if (dbi.isInit()) {
        onPress = () => {
            Alert.alert(Strings.Warning, Strings.OpenFileWarn, [{
                text: Strings.ButtonCancel,
                style: 'cancel',
            }, {
                text: Strings.ButtonContinue,
                style: 'destructive',
                onPress: fileOpen,
            }])
        }
    } else {
        onPress = fileOpen
    }

    return <Button title={Strings.OpenFileButton} onPress={onPress} />
}
