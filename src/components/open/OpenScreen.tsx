import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Strings } from '../../strings/strings'
import { Navigation } from '../screen/propTypes'
import { ScreenTemplate } from '../screen/ScreenTemplate'
import { P } from '../screen/textComponents'
import { FileRequirements } from './FileRequirements'
import { OpenFileButton } from './OpenFileButton'

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
