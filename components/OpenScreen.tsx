import React from 'react'
import { View, ScrollView } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'
import { Strings } from '../strings/strings'

export function OpenScreen() {

    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameOpen} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>{Strings.OpenFileInstructions}</P>
                <FileRequirements />
                <OpenFileButton />
            </ScrollView>
        </View>
    )
}
