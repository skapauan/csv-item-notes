import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Overlay } from 'react-native-elements'
import { Strings } from '../../strings/strings'
import { styles } from '../../styles/styles'

export type OverlayTemplateProps = {
    children: React.ReactNode
    isVisible: boolean
    onCancel: () => void
    onSave: () => void
}

export function OverlayTemplate(props: OverlayTemplateProps): JSX.Element {
    const { children, isVisible, onCancel, onSave } = props
    return (
        <Overlay
            isVisible={isVisible}
            overlayStyle={{ height: '90%', width: '90%' }}
        >
            <ScrollView
                style={styles.bodyScrollOuter}
                contentContainerStyle={styles.bodyScrollInner}
            >
                {children}
            </ScrollView>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Button
                        title={Strings.ButtonCancel}
                        onPress={onCancel}
                        type="outline"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Button title={Strings.ButtonSave} onPress={onSave} />
                </View>
            </View>
        </Overlay>
    )
}
