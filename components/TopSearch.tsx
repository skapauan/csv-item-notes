import React, { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from './shared/styles'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'
import { findItemById } from './shared/async'

export function TopSearch() {
    const { dispatch } = React.useContext(StoreContext)
    const [text, setText] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const onFocus = () => {
        setText('')
        setIsFocused(true)
    }
    const onBlur = () => {
        setIsFocused(false)
    }
    const onSubmitEditing = () => {
        dispatch(findItemById(text))
    }
    
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
            { isFocused && text !== '' &&
            <Pressable
                onPress={() => setText('')}
                style={styles.topSearchCancel}
                >
                <MaterialIcons name="clear" size={28} color="black" />
            </Pressable>
            }
        </View>
    )
    
}
