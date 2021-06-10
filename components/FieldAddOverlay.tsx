import React from 'react'
import { ButtonGroup, Input } from 'react-native-elements'
import { ColumnType } from '../db/types'
import { updateFieldEditStatus } from './shared/actions'
import { StoreContext } from './shared/store'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { columnTypeEnums, columnTypeStrings } from '../strings/columntype'
import { Strings } from '../strings/strings'
import { addNoteField } from './thunks/addNoteField'
import { OverlayTemplate } from './OverlayTemplate'

export function FieldAddOverlay() {
    const { dispatch } = React.useContext(StoreContext)
    const [title, setTitle] = React.useState('')
    const [type, setType] = React.useState(ColumnType.Text)
    const [typeIndex, setTypeIndex] = React.useState(0)

    const chooseType = (index: number) => {
        setTypeIndex(index)
        setType(columnTypeEnums[index])
    }
    const onCancel = () => dispatch(updateFieldEditStatus(false))
    const onSave = () => dispatch(addNoteField({ title, type }))

    return (
        <OverlayTemplate isVisible={true} onCancel={onCancel} onSave={onSave}>
            <P>{Strings.FieldTitle}</P>
            <Input
                value={title}
                onChangeText={setTitle}
                style={styles.textInput}
                />
            <P>{Strings.FieldType}</P>
            <ButtonGroup
                onPress={chooseType}
                selectedIndex={typeIndex}
                buttons={columnTypeStrings}
                />
        </OverlayTemplate>
    )
}
