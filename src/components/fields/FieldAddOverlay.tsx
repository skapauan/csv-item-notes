import React from 'react'
import { ButtonGroup, Input } from 'react-native-elements'
import { ColumnType } from '../../database/types'
import { updateFieldEdit } from '../../redux/actions'
import { StoreContext } from '../../redux/store'
import { columnTypeEnums, columnTypeStrings } from '../../strings/columntype'
import { Strings } from '../../strings/strings'
import { styles } from '../../styles/styles'
import { addNoteField } from '../../thunks/addNoteField'
import { OverlayTemplate } from '../screen/OverlayTemplate'
import { P } from '../screen/textComponents'

export function FieldAddOverlay(): JSX.Element {
    const { dispatch } = React.useContext(StoreContext)
    const [title, setTitle] = React.useState('')
    const [type, setType] = React.useState(ColumnType.Text)
    const [typeIndex, setTypeIndex] = React.useState(0)

    const chooseType = (index: number) => {
        setTypeIndex(index)
        setType(columnTypeEnums[index])
    }
    const onCancel = () => dispatch(updateFieldEdit(false))
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
