
import React from 'react'
import { ScrollView } from 'react-native'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'

export function Loading() {
    return (
        <ScrollView style={styles.bodyScrollOuterSolo}
                contentContainerStyle={styles.bodyScrollInner}>
            <P>{Strings.Loading}</P>
        </ScrollView>
    )
}

