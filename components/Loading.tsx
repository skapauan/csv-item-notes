
import React from 'react'
import { ScrollView } from 'react-native'
import { LinearProgress } from 'react-native-elements'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { StoreContext } from './shared/store'

export function Loading() {
    const { getState } = React.useContext(StoreContext)
    const progress = getState().openFileProgress
    let progressBar
    if (progress >= 0) {
        progressBar = (<LinearProgress value={progress} variant="determinate"
            color="primary" />)
    }
    return (
        <ScrollView style={styles.bodyScrollOuterSolo}
                contentContainerStyle={styles.bodyScrollInner}>
            <P>{Strings.Loading}</P>
            {progressBar}
        </ScrollView>
    )
}
