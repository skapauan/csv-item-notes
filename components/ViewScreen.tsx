import React from 'react'
import { View, ScrollView } from 'react-native'
import { TopBar } from './TopBar'
import { styles } from './shared/styles'
import { P, DT, DD } from './shared/textComponents'
import { StoreContext } from './shared/store'
import { dbi } from '../db/dbInstance'

export function ViewScreen() {
    const { getState } = React.useContext(StoreContext)
    const { viewedItem, viewedError } = getState()

    let content
    if (viewedError) {
        content = <P>{viewedError}</P>
    } else if (viewedItem) {
        content = []
        let key = 0
        dbi.itemColumns.forEach((col, i) => {
            content.push(<DT key={key++}>{col.title || col.name}</DT>)
            content.push(<DD key={key++}>{viewedItem[i]}</DD>)
            viewedItem[i]
        })
    }

    return (
        <View style={styles.outerView}>
            <TopBar showSearch={true} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                {content}
            </ScrollView>
        </View>
    )
}
