import React from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './shared/styles'

export interface TopBarProps {
    navigation: any; //TODO
    showSearch?: boolean;
}

export interface ScreenProps {
    navigation: any; //TODO
}

export function TopBar(props: TopBarProps) {
    let search = props.showSearch
        ? (<TextInput style={styles.topSearchInput} keyboardType={'numeric'} 
            placeholder={'Enter item ID here'} />)
        : <View />
    return (
        <View style={styles.topBar}>
            <Pressable style={styles.menuIcon}
                    onPress={() => props.navigation.toggleDrawer()}>
                <Ionicons name="menu" size={36} color="black" />
            </Pressable>
            {search}
        </View>
    )
}
