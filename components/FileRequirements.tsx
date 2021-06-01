import React from 'react'
import { View } from 'react-native'
import { P, LI } from './shared/textComponents'
import { Strings } from '../strings/strings'

export function FileRequirements() {
    return (
        <View>
            <P>{Strings.FileRequirements}</P>
            <LI>{Strings.FileRequirement1}</LI>
            <LI>{Strings.FileRequirement2}</LI>
            <LI>{Strings.FileRequirement3}</LI>
        </View>
    )
}
