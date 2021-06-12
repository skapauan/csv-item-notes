import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/core'
import { ColumnType } from '../db/types'
import { StoreContext } from './shared/store'
import { styles, topIconColor } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { NoteCheckbox } from './NoteCheckbox'
import { NoteTextInput } from './NoteTextInput'

export function NotesSheet() {
    const { getState } = React.useContext(StoreContext)
    const { noteFields } = getState()
    const [ sheetVisible, setSheetVisible ] = React.useState(false)

    const toggleSheet = () => setSheetVisible(!sheetVisible)

    let content: JSX.Element[] = []
    noteFields.forEach((col, index) => {
        const title = col.title || col.name
        const { type } = col
        if (type === ColumnType.Boolean) {
            const props = { key: index, index, title }
            content.push( <NoteCheckbox {...props} /> )
        } else {
            // ColumnType.Numeric or ColumnType.Text
            const props = { key: index, index, title,
                numeric: type === ColumnType.Numeric }
            content.push( <NoteTextInput {...props} /> )
        }
    })
    if (content.length < 1) {
        const navigation = useNavigation()
        let fieldsButton
        if (navigation) {
            const goFields = () => navigation.navigate(Strings.ScreenNameFields)
            fieldsButton = (
                <Button title={Strings.ScreenNameFields} onPress={goFields} />
            )
        }
        content.push(
            <View key={-1}>
                <P>{Strings.NoNoteFields}</P>
                {fieldsButton}
            </View>
        )
    }

    const iconName = sheetVisible ? 'keyboard-arrow-down' : 'keyboard-arrow-up'

    return (
        <View style={[styles.notesSheet, sheetVisible?{flex:1}:{height:50}]}>
            <Button
                icon={<Icon name={iconName} color={topIconColor} />}
                onPress={toggleSheet}
                title={Strings.Notes}
                titleStyle={styles.bodyFont}
                type="clear"
                />
            { sheetVisible && 
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                {content}
            </ScrollView>
            }
        </View>
    )
}
