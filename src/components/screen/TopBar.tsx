import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { styles, topIconColor } from '../../styles/styles'
import { Navigation } from '../screen/propTypes'
import { TopSearch } from './TopSearch'

export interface TopBarProps {
    showSearch?: boolean
    title?: string
}

export function TopBar(props: TopBarProps): JSX.Element {
    const navigation: Navigation = useNavigation()
    const onPress = () => navigation.toggleDrawer()
    const content = props.showSearch ? (
        <TopSearch />
    ) : (
        <View>
            <Text style={styles.topTitle}>
                {props.title ? props.title : ''}
            </Text>
        </View>
    )
    return (
        <View style={styles.topBar}>
            <Pressable style={styles.iconButton} onPress={onPress}>
                <MaterialIcons name="menu" size={36} color={topIconColor} />
            </Pressable>
            {content}
        </View>
    )
}
