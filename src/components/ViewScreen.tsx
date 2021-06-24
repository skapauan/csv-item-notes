import React from 'react'
import { dbi } from '../database/dbInstance'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { NotesSheet } from './NotesSheet'
import { ScreenTemplate } from './ScreenTemplate'
import { DD, DT, P } from './textComponents'

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

    const notes = haveNotes ? <NotesSheet /> : undefined

    return (
        <ScreenTemplate
            after={notes}
            showSearch={true}
            title={Strings.ScreenNameView}
        >
            {content}
        </ScreenTemplate>
    )
}
