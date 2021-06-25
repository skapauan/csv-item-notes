import React from 'react'
import { ScrollView } from 'react-native'
import { Strings } from '../../strings/strings'
import { styles } from '../../styles/styles'
import { FileRequirements } from '../open/FileRequirements'
import { OpenFileButton } from '../open/OpenFileButton'
import { P } from '../screen/textComponents'

export function Intro(): JSX.Element {
    return (
        <ScrollView
            style={styles.bodyScrollOuterSolo}
            contentContainerStyle={styles.bodyScrollInner}
        >
            <P>{Strings.IntroInstructions}</P>
            <FileRequirements />
            <OpenFileButton />
        </ScrollView>
    )
}
