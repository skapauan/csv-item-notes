import React from 'react'
import { Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { openFile } from './shared/async'

export interface OpenFileButtonProps { navigation?: any; }

export function OpenFileButton({ navigation }: OpenFileButtonProps) {
    const { dispatch } = React.useContext(StoreContext)
    const showError = (message: string) => {
        Alert.alert(Strings.LoadFileError, message)
    }
    const success = () => {
        if (navigation) {
            Alert.alert(Strings.LoadFileDone)
            navigation.navigate(Strings.ScreenNameView)
        }
    }
    const onPress = () => dispatch(openFile(showError, success))

    return <Button title={Strings.OpenFileButton} onPress={onPress} />
}
