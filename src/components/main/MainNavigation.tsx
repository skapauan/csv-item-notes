import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { Strings } from '../../strings/strings'
import { FieldsScreen } from '../fields/FieldsScreen'
import { OpenScreen } from '../open/OpenScreen'
import { SaveScreen } from '../save/SaveScreen'
import { SettingsScreen } from '../settings/SettingsScreen'
import { ViewScreen } from '../view/ViewScreen'

const Drawer = createDrawerNavigator()

export function MainNavigation(): JSX.Element {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName={Strings.ScreenNameView}>
                <Drawer.Screen
                    name={Strings.ScreenNameView}
                    component={ViewScreen}
                />
                <Drawer.Screen
                    name={Strings.ScreenNameFields}
                    component={FieldsScreen}
                />
                <Drawer.Screen
                    name={Strings.ScreenNameSave}
                    component={SaveScreen}
                />
                <Drawer.Screen
                    name={Strings.ScreenNameOpen}
                    component={OpenScreen}
                />
                <Drawer.Screen
                    name={Strings.ScreenNameSettings}
                    component={SettingsScreen}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
