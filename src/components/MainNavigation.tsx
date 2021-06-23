import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Strings } from '../strings/strings'
import { ViewScreen } from './ViewScreen'
import { FieldsScreen } from './FieldsScreen'
import { SaveScreen } from './SaveScreen'
import { OpenScreen } from './OpenScreen'
import { SettingsScreen } from './SettingsScreen'

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
