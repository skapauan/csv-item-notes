import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Strings } from '../strings/strings'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'
import { Navigation } from './propTypes'
import { P } from './textComponents'
import { ScreenTemplate } from './ScreenTemplate'

export function OpenScreen(): JSX.Element {
    const navigation: Navigation = useNavigation()

    return (
        <ScreenTemplate title={Strings.ScreenNameOpen}>
            <P>{Strings.OpenFileInstructions}</P>
            <FileRequirements />
            <OpenFileButton navigation={navigation} />
        </ScreenTemplate>
    )
}
