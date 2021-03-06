import React from 'react'
import { Button } from 'react-native-elements'
import { updateFieldEdit } from '../../redux/actions'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'
import { ScreenTemplate } from '../screen/ScreenTemplate'
import { FieldAddOverlay } from './FieldAddOverlay'
import { FieldEditOverlay } from './FieldEditOverlay'
import { FieldItem } from './FieldItem'

export function FieldsScreen(): JSX.Element {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { fieldEdit, noteFields } = getState()

    const fieldItems: JSX.Element[] = []
    noteFields.forEach((field, index) => {
        fieldItems.push(<FieldItem field={field} key={index} />)
    })

    let overlay
    if (typeof fieldEdit !== 'boolean')
        overlay = <FieldEditOverlay field={fieldEdit} />
    else if (fieldEdit === true) overlay = <FieldAddOverlay />

    const addFieldBtn = () => dispatch(updateFieldEdit(true))

    return (
        <ScreenTemplate after={overlay} title={Strings.ScreenNameFields}>
            {fieldItems}
            <Button title={Strings.FieldAddButton} onPress={addFieldBtn} />
        </ScreenTemplate>
    )
}
