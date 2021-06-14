import React from 'react'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { saveFile } from './thunks/saveFile'

export interface SaveFileButtonProps { itemsWithNotesOnly?: boolean; }

export function SaveFileButton({ itemsWithNotesOnly }: SaveFileButtonProps) {
    const { dispatch, getState } = React.useContext(StoreContext)
    const buttonType = getState().fileSaved ? 'outline' : 'solid'
    const onPress = () => dispatch(saveFile(itemsWithNotesOnly))

    return <Button title={Strings.ButtonSave} onPress={onPress} type={buttonType} />
}