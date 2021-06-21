import React from 'react'
import { View, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { getColumnTypeString } from '../strings/columntype'
import { ItemColumn } from '../database/types'
import { StoreContext } from '../redux/store'
import { updateFieldEditStatus } from '../redux/actions'
import { styles, topIconColor } from '../styles/styles'
import { P } from './textComponents'

export type FieldItemProps = { field: ItemColumn }

export function FieldItem({ field }: FieldItemProps) {
    const { dispatch } = React.useContext(StoreContext)
    const { id, name, order, title, type } = field

    const onPressEdit = () => dispatch(updateFieldEditStatus(field))

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <P>{title} ({getColumnTypeString(type)})</P>
            </View>
            <Pressable style={styles.iconButton} onPress={onPressEdit}>
                <MaterialIcons name="edit" size={36} color={topIconColor} />
            </Pressable>
        </View>
    )
}
