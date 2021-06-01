import React from 'react'
import { Text, View } from 'react-native'
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

export function LI(props: TextProps) {
    return (
        <View style={styles.li_outer}>
            <Text style={styles.li_bullet}>{'\u2022'}</Text>
            <Text style={styles.li_inner}>{props.children}</Text>
        </View>
    )
}