import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { ColumnType } from '../../database/types'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'
import { styles, topIconColor } from '../../styles/styles'
import { Navigation } from '../screen/propTypes'
import { P } from '../screen/textComponents'
import { NoteCheckbox } from './NoteCheckbox'
import { NoteTextInput } from './NoteTextInput'

export function NotesSheet(): JSX.Element {
    const navigation: Navigation = useNavigation()
    const { getState } = React.useContext(StoreContext)
    const { noteFields } = getState()
    const [sheetVisible, setSheetVisible] = React.useState(false)

    const toggleSheet = () => setSheetVisible(!sheetVisible)

    const content: JSX.Element[] = []
    noteFields.forEach((col, index) => {
        const title = col.title || col.name
        const { type } = col
        if (type === ColumnType.Boolean) {
            const props = { key: index, index, title }
            content.push(<NoteCheckbox {...props} />)
        } else {
            // ColumnType.Numeric or ColumnType.Text
            const props = {
                key: index,
                index,
                title,
                numeric: type === ColumnType.Numeric,
            }
            content.push(<NoteTextInput {...props} />)
        }
    })
    if (content.length < 1) {
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
            </View>,
        )
    }

    const iconName = sheetVisible ? 'keyboard-arrow-down' : 'keyboard-arrow-up'

    return (
        <View
            style={[
                styles.notesSheet,
                sheetVisible ? { flex: 1 } : { height: 50 },
            ]}
        >
            <Button
                icon={<Icon name={iconName} color={topIconColor} />}
                onPress={toggleSheet}
                title={Strings.Notes}
                titleStyle={styles.bodyFont}
                type="clear"
            />
            {sheetVisible && (
                <ScrollView
                    style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}
                >
                    {content}
                </ScrollView>
            )}
        </View>
    )
}
