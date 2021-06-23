import React from 'react'
import { View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'
import { Navigation } from './propTypes'
import { P } from './textComponents'
import { TopBar } from './TopBar'

export function OpenScreen(): JSX.Element {
    const navigation: Navigation = useNavigation()

    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameOpen} />
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                <P>{Strings.OpenFileInstructions}</P>
                <FileRequirements />
                <OpenFileButton navigation={navigation} />
            </ScrollView>
        </View>
    )
}
