import React, { useState } from 'react'
import { Keyboard, Pressable, TextInput, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { styles, topIconColor } from './shared/styles'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { findItemById } from './thunks/findItemById'

export function TopSearch() {
    const { dispatch } = React.useContext(StoreContext)
    const [text, setText] = useState('')
    const [lastSearched, setLastSearched] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const onFocus = () => {
        if (text === lastSearched) setText('')
        setIsFocused(true)
    }
    const onBlur = () => {
        setIsFocused(false)
    }
    const onSubmitEditing = () => {
        setLastSearched(text)
        dispatch(findItemById(text))
    }
    const onPressDone = () => {
        onSubmitEditing()
        Keyboard.dismiss()
    }
    const onPressClear = () => setText('')
    
    return (
        <View style={styles.topSearch}>
            <TextInput
                value={text}
                onChangeText={setText}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={onSubmitEditing}
                keyboardType={'numeric'}
                placeholder={Strings.ItemIdPlaceholder}
                style={styles.topSearchInput}
                />
            { isFocused && text !== '' && text !== lastSearched &&
            <Pressable onPress={onPressClear} style={styles.topSearchButton}>
                <MaterialIcons name="clear" size={28} color={topIconColor} />
            </Pressable>
            }
            { isFocused && text !== '' &&
            <Pressable onPress={onPressDone} style={styles.topSearchButton}>
                <MaterialIcons name="done" size={28} color={topIconColor} />
            </Pressable>
            }
        </View>
    )
    
}
