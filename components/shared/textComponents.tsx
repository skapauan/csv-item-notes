import React from 'react'
import { Text } from 'react-native'
import { styles } from './styles'

interface TextProps {
    children: any; //TODO
}

export function P(props: TextProps) {
    return (
        <Text style={styles.p}>{props.children}</Text>
    )
}

export function DT(props: TextProps) {
    return (
        <Text style={styles.dt}>{props.children}</Text>
    )
}

export function DD(props: TextProps) {
    return (
        <Text style={styles.dd}>{props.children}</Text>
    )
}
