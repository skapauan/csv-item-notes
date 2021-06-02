import React, { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from './shared/styles'
import { Strings } from '../strings/strings'

export function TopSearch() {
    const [text, setText] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const onFocus = () => {
        setText('')
        setIsFocused(true)
    }
    const onBlur = () => {
        setIsFocused(false)
    }
    const onSubmitEditing = () => {}
    
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
