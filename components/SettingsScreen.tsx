import React from 'react'
import { View, ScrollView } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'

export function SettingsScreen() {
    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSettings} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>SettingsScreen</P>
            </ScrollView>
        </View>
    )
}
