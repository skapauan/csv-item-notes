import React from 'react'
import { View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { TopBar } from './TopBar'
import { updateFieldEditStatus } from './shared/actions'
import { styles } from './shared/styles'
import { StoreContext } from './shared/store'
import { Strings } from '../strings/strings'
import { FieldItem } from './FieldItem'
import { FieldAddOverlay } from './FieldAddOverlay'
import { FieldEditOverlay } from './FieldEditOverlay'

export function FieldsScreen() {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { fieldEditStatus, noteFields } = getState()

    const fieldItems: JSX.Element[] = []
    noteFields.forEach((field, index) => {
        fieldItems.push(<FieldItem field={field} key={index} />)
    })

    let overlay
    if (typeof fieldEditStatus !== 'boolean')
        overlay = <FieldEditOverlay field={fieldEditStatus} />
    else if (fieldEditStatus === true)
        overlay = <FieldAddOverlay />

    const addFieldBtn = () => dispatch(updateFieldEditStatus(true))
    
    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameFields} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                {fieldItems}
                <Button title={Strings.FieldAddButton} onPress={addFieldBtn} />
            </ScrollView>
            {overlay}
        </View>
    )
}
