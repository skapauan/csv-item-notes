import React from 'react'
import { View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { TopBar } from './TopBar'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { P } from './textComponents'

export function OpenScreen() {
    const navigation = useNavigation()

    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameOpen} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>{Strings.OpenFileInstructions}</P>
                <FileRequirements />
                <OpenFileButton navigation={navigation} />
            </ScrollView>
        </View>
    )
}
