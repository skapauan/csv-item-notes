import React from 'react'
import { View } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { DT, DD } from './shared/textComponents'

export function ViewScreen() {
    return (
        <View style={styles.outerView}>
            <TopBar showSearch={true} />
            <View style={styles.body}>
                <DT>Field 1</DT>
                <DD>Value 1</DD>
                <DT>Field 2</DT>
                <DD>Value 2</DD>
            </View>
        </View>
    )
}
