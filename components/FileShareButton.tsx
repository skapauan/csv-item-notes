import React from 'react'
import { Button } from 'react-native-elements'
import { shareSavedFile } from '../fs/shareSavedFile'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'

export function FileShareButton() {
    const { getState } = React.useContext(StoreContext)
    const { saveInternalUri } = getState()
    const onPress = () => shareSavedFile(saveInternalUri)
    return <Button title={Strings.FileShareButton} onPress={onPress} />
}
