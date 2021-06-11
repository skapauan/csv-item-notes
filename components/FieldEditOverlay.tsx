import React from 'react'
import { Input } from 'react-native-elements'
import { ItemColumn } from '../db/types'
import { updateFieldEditStatus } from './shared/actions'
import { StoreContext } from './shared/store'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { styles } from './shared/styles'
import { modifyNoteField } from './thunks/modifyNoteField'
import { OverlayTemplate } from './OverlayTemplate'

export type FieldEditOverlayProps = { field: ItemColumn }

export function FieldEditOverlay({ field }: FieldEditOverlayProps) {
    const { dispatch } = React.useContext(StoreContext)
    const [title, setTitle] = React.useState(field.title)

    const onCancel = () => dispatch(updateFieldEditStatus(false))
    const onSave = () => dispatch(modifyNoteField({...field, title}))

    return (
        <OverlayTemplate isVisible={true} onCancel={onCancel} onSave={onSave}>
            <P>{Strings.FieldTitle}</P>
            <Input
                value={title}
                onChangeText={setTitle}
                style={styles.textInput}
                />
        </OverlayTemplate>
    )
}
