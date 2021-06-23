import React from 'react'
import { Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { ItemColumn } from '../database/types'
import { updateFieldEdit } from '../redux/actions'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles, topIconColor } from '../styles/styles'
import { deleteNoteField } from '../thunks/deleteNoteField'
import { modifyNoteField } from '../thunks/modifyNoteField'
import { OverlayTemplate } from './OverlayTemplate'
import { P } from './textComponents'

export type FieldEditOverlayProps = { field: ItemColumn }

export function FieldEditOverlay({
    field,
}: FieldEditOverlayProps): JSX.Element {
    const { dispatch } = React.useContext(StoreContext)
    const [title, setTitle] = React.useState(field.title)

    const onCancel = () => dispatch(updateFieldEdit(false))
    const onSave = () => dispatch(modifyNoteField({ ...field, title }))
    const onDelete = () => {
        Alert.alert(Strings.Warning, Strings.FieldDeleteWarn, [
            {
                text: Strings.ButtonCancel,
                style: 'cancel',
            },
            {
                text: Strings.ButtonDelete,
                style: 'destructive',
                onPress: () => dispatch(deleteNoteField(field)),
            },
        ])
    }

    return (
        <OverlayTemplate isVisible={true} onCancel={onCancel} onSave={onSave}>
            <P>{Strings.FieldTitle}</P>
            <Input
                value={title}
                onChangeText={setTitle}
                style={styles.textInput}
            />
            <Button
                title={Strings.FieldDeleteButton}
                type="clear"
                icon={
                    <MaterialIcons
                        name="delete"
                        size={28}
                        color={topIconColor}
                    />
                }
                onPress={onDelete}
            />
        </OverlayTemplate>
    )
}
