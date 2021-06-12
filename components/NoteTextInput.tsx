import React from 'react'
import { View, Text } from 'react-native'
import { Input } from 'react-native-elements'
import { StoreContext } from './shared/store'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { saveNoteInput } from './thunks/saveNoteInput'
import { setNoteInput } from './thunks/setNoteInput'

export interface NoteTextInputProps
    { index: number; title: string; numeric?: boolean }

export function NoteTextInput({ index, title, numeric }: NoteTextInputProps) {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { noteInput } = getState()
    const onChangeText = (value: string) => dispatch(setNoteInput(index, value))
    const onSubmit = () => dispatch(saveNoteInput())
    const keyboardType = numeric ? 'numeric' : 'default'
    return (
        <Input
            label={title}
            value={''+noteInput[index]}
            onChangeText={onChangeText}
            onBlur={onSubmit}
            onSubmitEditing={onSubmit}
            keyboardType={keyboardType}
            />
    )
}
