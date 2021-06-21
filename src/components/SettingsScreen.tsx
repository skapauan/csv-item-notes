import React from 'react'
import { View, ScrollView } from 'react-native'
import { dbi } from '../database/dbInstance'
import { DBQueries } from '../database/queries'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { P } from './textComponents'
import { TopBar } from './TopBar'

export function SettingsScreen() {
    const [itemsRows, setItemsRows] = React.useState(0)
    const [itemColsRows, setItemColsRows] = React.useState(0)
    const { getState } = React.useContext(StoreContext)
    React.useEffect(() => {
        if (dbi.isInit()) {
            dbi.query(DBQueries.SelectCountItems)
            .then(({ rows }) => setItemsRows(rows.item(0)?.count))
            dbi.query(DBQueries.SelectCountItemCols)
            .then(({ rows }) => setItemColsRows(rows.item(0)?.count))
        }
    }, [getState().dataStatus])
    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSettings} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>{Strings.DiagnosticInfo}</P>
                <P>items rows: {itemsRows}</P>
                <P>item_cols rows: {itemColsRows}</P>
            </ScrollView>
        </View>
    )
}
