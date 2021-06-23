import React from 'react'
import { Alert, ToastAndroid } from 'react-native'
import { Button } from 'react-native-elements'
import { dbi } from '../database/dbInstance'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { FileInfo, openFile } from '../thunks/openFile'
import { Navigation } from './propTypes'

export interface OpenFileButtonProps {
    navigation?: Navigation
}

export function OpenFileButton({
    navigation,
}: OpenFileButtonProps): JSX.Element {
    const { dispatch } = React.useContext(StoreContext)

    const showError = (message: string) => {
        Alert.alert(Strings.LoadFileError, message)
    }
    const showCancel = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.SHORT)
    }
    const success = (fileInfo: FileInfo) => {
        const { document, loadTime, rows } = fileInfo
        let message
        if (document.type === 'success') {
            message = Strings.LoadFileInfo.replace('%', '' + document.name)
                .replace('%', '' + document.size)
                .replace('%', '' + rows)
                .replace('%', '' + loadTime / 1000)
        }
        Alert.alert(Strings.LoadFileDone, message)
        if (navigation) {
            navigation.navigate(Strings.ScreenNameView)
        }
    }

    const fileOpen = () => dispatch(openFile(success, showCancel, showError))
    let onPress
    if (dbi.isInit()) {
        onPress = () => {
            Alert.alert(Strings.Warning, Strings.OpenFileWarn, [
                {
                    text: Strings.ButtonCancel,
                    style: 'cancel',
                },
                {
                    text: Strings.ButtonContinue,
                    style: 'destructive',
                    onPress: fileOpen,
                },
            ])
        }
    } else {
        onPress = fileOpen
    }

    return <Button title={Strings.OpenFileButton} onPress={onPress} />
}
