import React from 'react'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { shareSavedFile } from './thunks/shareSavedFile'

export function FileShareButton() {
    const { dispatch } = React.useContext(StoreContext)
    const onPress = () => dispatch(shareSavedFile())
    return <Button title={Strings.FileShareButton} onPress={onPress} />
}
