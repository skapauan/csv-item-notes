import React from 'react'
import { CheckBox } from 'react-native-elements'
import { StoreContext } from '../redux/store'
import { saveNoteInput } from '../thunks/saveNoteInput'
import { setNoteInput } from '../thunks/setNoteInput'

export interface NoteCheckboxProps { index: number; title: string; }

export function NoteCheckbox({ index, title }: NoteCheckboxProps) {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { noteInput } = getState()
    const onPress = () => {
        const value = !noteInput[index]
        dispatch(setNoteInput(index, value))
        dispatch(saveNoteInput())
    }
    return (
        <CheckBox
            title={title}
            checked={!!noteInput[index]}
            onPress={onPress} />
    )
}
