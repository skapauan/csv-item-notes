import React from 'react'
import { Button } from 'react-native-elements'
import { shareSavedFile } from '../filesystem/shareSavedFile'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'

export function FileShareButton() {
    const { getState } = React.useContext(StoreContext)
    const { saveInternalUri } = getState()
    const onPress = () => shareSavedFile(saveInternalUri)
    return <Button title={Strings.FileShareButton} onPress={onPress} />
}
