import React from 'react'
import { Pressable, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ItemColumn } from '../../database/types'
import { updateFieldEdit } from '../../redux/actions'
import { StoreContext } from '../../redux/store'
import { getColumnTypeString } from '../../strings/columntype'
import { styles, topIconColor } from '../../styles/styles'
import { P } from '../screen/textComponents'

export type FieldItemProps = { field: ItemColumn }

export function FieldItem({ field }: FieldItemProps): JSX.Element {
    const { dispatch } = React.useContext(StoreContext)
    const { title, type } = field

    const onPressEdit = () => dispatch(updateFieldEdit(field))

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <P>
                    {title} ({getColumnTypeString(type)})
                </P>
            </View>
            <Pressable style={styles.iconButton} onPress={onPressEdit}>
                <MaterialIcons name="edit" size={36} color={topIconColor} />
            </Pressable>
        </View>
    )
}
