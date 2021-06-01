
import React from 'react'
import { ScrollView } from 'react-native'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'

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

