import React from 'react'
import { Button } from 'react-native-elements'
import { viewSavedFile } from '../fs/viewSavedFile'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'

export function FileViewButton() {
    const { getState } = React.useContext(StoreContext)
    const { saveExternalUri, saveInternalUri } = getState()
    const onPress = () => viewSavedFile(
        saveExternalUri || saveInternalUri,
        !!saveExternalUri
    )
    return <Button title={Strings.FileViewButton} onPress={onPress} />
}
