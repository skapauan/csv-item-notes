import React from 'react'
import { View, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ItemColumn } from '../db/types'
import { updateFieldEditStatus } from './shared/actions'
import { StoreContext } from './shared/store'
import { styles, topIconColor } from './shared/styles'
import { P } from './shared/textComponents'
import { getColumnTypeString } from '../strings/columntype'

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
