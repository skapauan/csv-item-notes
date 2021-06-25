import React from 'react'
import { ScrollView, View } from 'react-native'
import { styles } from '../../styles/styles'
import { TopBar } from './TopBar'

export interface ScreenTemplateProps {
    after?: React.ReactNode
    children: React.ReactNode
    showSearch?: boolean
    title?: string
}

export function ScreenTemplate(props: ScreenTemplateProps): JSX.Element {
    const { after, children, showSearch, title } = props
    const topBarProps = { showSearch, title }
    return (
        <View style={styles.outerView}>
            <TopBar {...topBarProps} />
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                {children}
            </ScrollView>
            {after}
        </View>
    )
}
