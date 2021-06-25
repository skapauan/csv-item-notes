import React from 'react'
import { dbi } from '../../database/dbInstance'
import { DBQueries } from '../../database/queries'
import { ItemColumn } from '../../database/types'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'
import { ScreenTemplate } from '../screen/ScreenTemplate'
import { LI, P } from '../screen/textComponents'

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
        <ScreenTemplate title={Strings.ScreenNameSettings}>
            <P>{Strings.DiagnosticInfo}</P>
            <P>items rows: {itemsRows}</P>
            <P>item_cols rows: {itemColsRows}</P>
            <P>note fields:</P>
            {fields}
            <P>noteColumnNames:</P>
            <P>{names}</P>
        </ScreenTemplate>
    )
}
