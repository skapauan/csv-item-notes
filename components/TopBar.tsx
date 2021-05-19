import React from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './shared/styles'
import { useNavigation } from '@react-navigation/native'

export interface TopBarProps {
    showSearch?: boolean;
}

export function TopBar(props: TopBarProps) {
    const navigation: any = useNavigation()
    const search = props.showSearch
        ? (<TextInput style={styles.topSearchInput} keyboardType={'numeric'} 
            placeholder={'Enter item ID here'} />)
        : <View />
    return (
        <View style={styles.topBar}>
            <Pressable style={styles.menuIcon}
                    onPress={() => navigation.toggleDrawer()}>
                <Ionicons name="menu" size={36} color="black" />
            </Pressable>
            {search}
        </View>
    )
}
