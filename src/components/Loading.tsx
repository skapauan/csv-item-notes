import React from 'react'
import { ScrollView } from 'react-native'
import { LinearProgress } from 'react-native-elements'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { P } from './textComponents'

export function Loading(): JSX.Element {
    const { getState } = React.useContext(StoreContext)
    const progress = getState().openFileProgress
    let progressBar
    if (progress >= 0) {
        progressBar = (
            <LinearProgress
                value={progress}
                variant="determinate"
                color="primary"
            />
        )
    }
    return (
        <ScrollView
            style={styles.bodyScrollOuterSolo}
            contentContainerStyle={styles.bodyScrollInner}
        >
            <P>{Strings.Loading}</P>
            {progressBar}
        </ScrollView>
    )
}
