import React from 'react'
import { Button } from 'react-native-elements'
import { viewSavedFile } from '../../filesystem/viewSavedFile'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'

export function FileViewButton(): JSX.Element {
    const { getState } = React.useContext(StoreContext)
    const { saveExternalUri, saveInternalUri } = getState()
    const onPress = () =>
        viewSavedFile(saveExternalUri || saveInternalUri, !!saveExternalUri)
    return <Button title={Strings.FileViewButton} onPress={onPress} />
}
