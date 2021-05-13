import React from 'react'
import { View } from 'react-native'
import { TopBar, ScreenProps } from './TopBar'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'

export function SettingsScreen({ navigation }: ScreenProps) {
    return (
        <View style={styles.outerView}>
            <TopBar navigation={navigation} />
            <View style={styles.body}>
                <P>SettingsScreen</P>
            </View>
        </View>
    )
}
