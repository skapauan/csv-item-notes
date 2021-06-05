import React from 'react'
import { View, ScrollView } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'

export function SaveScreen() {
    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSave} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>{Strings.NothingHere}</P>
            </ScrollView>
        </View>
    )
}
