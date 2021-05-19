import React from 'react'
import { View } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'

export function SettingsScreen() {
    return (
        <View style={styles.outerView}>
            <TopBar />
            <View style={styles.body}>
                <P>SettingsScreen</P>
            </View>
        </View>
    )
}
