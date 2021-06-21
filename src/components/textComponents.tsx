import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { Text, View } from 'react-native'
import { styles } from '../styles/styles'

interface TextProps {
    children: any;
    centered?: boolean;
}

function getStyle(base: StyleProp<TextStyle>, props: TextProps)
: StyleProp<TextStyle>[] {
    const style = [base]
    if (props.centered) style.push(styles.centered)
    return style
}

export function P(props: TextProps) {
    const style = getStyle(styles.p, props)
    return (
        <Text style={style}>{props.children}</Text>
    )
}

export function DT(props: TextProps) {
    const style = getStyle(styles.dt, props)
    return (
        <Text style={style}>{props.children}</Text>
    )
}

export function DD(props: TextProps) {
    const style = getStyle(styles.dd, props)
    return (
        <Text style={style}>{props.children}</Text>
    )
}

export function LI(props: TextProps) {
    if (props.centered) {
        return (
            <Text style={[styles.p, styles.centered]}>
                {'\u2022  '}{props.children}
            </Text>
        )
    }
    return (
        <View style={styles.li_outer}>
            <Text style={styles.li_bullet}>{'\u2022'}</Text>
            <Text style={styles.li_inner}>{props.children}</Text>
        </View>
    )
}