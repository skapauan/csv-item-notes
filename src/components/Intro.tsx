
import React from 'react'
import { ScrollView } from 'react-native'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'
import { P } from './textComponents'

export function Intro() {
    return (
        <ScrollView style={styles.bodyScrollOuterSolo}
                contentContainerStyle={styles.bodyScrollInner}>
            <P>{Strings.IntroInstructions}</P>
            <FileRequirements />
            <OpenFileButton />
        </ScrollView>
    )
}

