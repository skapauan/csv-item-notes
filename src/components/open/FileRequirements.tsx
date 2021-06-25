import React from 'react'
import { View } from 'react-native'
import { Strings } from '../../strings/strings'
import { LI, P } from '../screen/textComponents'

export function FileRequirements(): JSX.Element {
    return (
        <View>
            <P>{Strings.FileRequirements}</P>
            <LI>{Strings.FileRequirement1}</LI>
            <LI>{Strings.FileRequirement2}</LI>
            <LI>{Strings.FileRequirement3}</LI>
        </View>
    )
}
