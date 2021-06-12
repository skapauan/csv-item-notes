import React from 'react'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { viewSavedFile } from './thunks/viewSavedFile'

export function FileViewButton() {
    const { dispatch } = React.useContext(StoreContext)
    const onPress = () => dispatch(viewSavedFile())
    return <Button title={Strings.FileViewButton} onPress={onPress} />
}
