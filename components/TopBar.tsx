import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './shared/styles'
import { useNavigation } from '@react-navigation/native'
import { Strings } from '../strings/strings'

export interface TopBarProps {
    showSearch?: boolean;
    title?: string;
}

export function TopBar(props: TopBarProps) {
    const navigation: any = useNavigation()
    const search = props.showSearch
        ? (<TextInput style={styles.topSearchInput} keyboardType={'numeric'} 
            placeholder={Strings.ItemIdPlaceholder} />)
        : (<View><Text style={styles.topTitle}>
            {props.title ? props.title : ''}</Text></View>)
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
