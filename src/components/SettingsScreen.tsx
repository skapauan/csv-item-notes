import React from 'react'
import { View, ScrollView } from 'react-native'
import { dbi } from '../database/dbInstance'
import { DBQueries } from '../database/queries'
import { ItemColumn } from '../database/types'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { LI, P } from './textComponents'
import { TopBar } from './TopBar'

export function SettingsScreen(): JSX.Element {
    const [itemsRows, setItemsRows] = React.useState(0)
    const [itemColsRows, setItemColsRows] = React.useState(0)
    const { getState } = React.useContext(StoreContext)
    const { dataStatus, noteFields } = getState()
    React.useEffect(() => {
        if (dbi.isInit()) {
            dbi.query(DBQueries.SelectCountItems).then(({ rows }) =>
                setItemsRows(rows.item(0)?.count),
            )
            dbi.query(DBQueries.SelectCountItemCols).then(({ rows }) =>
                setItemColsRows(rows.item(0)?.count),
            )
        }
    }, [dataStatus])
    const fieldToText = (field: ItemColumn): string => {
        const { id, index, isNote, name, order, title, type } = field
        return `${title} (${type}) [${id},${index},${isNote},${name},${order}]`
    }
    const fields = noteFields.map((field, index) => {
        return <LI key={index}>{fieldToText(field)}</LI>
    })
    const names = dbi.savedQueries.noteColumnNames.join(', ')
    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSettings} />
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                <P>{Strings.DiagnosticInfo}</P>
                <P>items rows: {itemsRows}</P>
                <P>item_cols rows: {itemColsRows}</P>
                <P>note fields:</P>
                {fields}
                <P>noteColumnNames:</P>
                <P>{names}</P>
            </ScrollView>
        </View>
    )
}
