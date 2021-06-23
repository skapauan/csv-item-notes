import React from 'react'
import { View, ScrollView } from 'react-native'
import { dbi } from '../database/dbInstance'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { NotesSheet } from './NotesSheet'
import { DD, DT, P } from './textComponents'
import { TopBar } from './TopBar'

export function ViewScreen(): JSX.Element {
    const { getState } = React.useContext(StoreContext)
    const { viewedItem, viewedError } = getState()

    let content,
        haveNotes = false
    if (viewedError) {
        content = <P>{viewedError}</P>
    } else if (viewedItem) {
        haveNotes = true
        content = []
        let key = 0
        dbi.itemColumns.forEach(({ isNote, name, title }, i) => {
            if (isNote) return
            content.push(<DT key={key++}>{title || name}</DT>)
            content.push(<DD key={key++}>{viewedItem.itemColumnValues[i]}</DD>)
        })
    } else {
        content = <P>{Strings.ViewScreenInstructions}</P>
    }

    return (
        <View style={styles.outerView}>
            <TopBar showSearch={true} />
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                {content}
            </ScrollView>
            {haveNotes && <NotesSheet />}
        </View>
    )
}
