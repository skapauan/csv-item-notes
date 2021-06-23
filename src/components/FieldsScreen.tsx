import React from 'react'
import { View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { StoreContext } from '../redux/store'
import { updateFieldEdit } from '../redux/actions'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { FieldAddOverlay } from './FieldAddOverlay'
import { FieldEditOverlay } from './FieldEditOverlay'
import { FieldItem } from './FieldItem'
import { TopBar } from './TopBar'

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
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameFields} />
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                {fieldItems}
                <Button title={Strings.FieldAddButton} onPress={addFieldBtn} />
            </ScrollView>
            {overlay}
        </View>
    )
}
