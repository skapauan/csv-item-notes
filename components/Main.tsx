
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { StatusBar } from 'expo-status-bar'
import { ViewScreen } from './ViewScreen'
import { SaveScreen } from './SaveScreen'
import { OpenScreen } from './OpenScreen'
import { SettingsScreen } from './SettingsScreen'

const Drawer = createDrawerNavigator()

export default function Main() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="View current">
                <Drawer.Screen name="View current" component={ViewScreen} />
                <Drawer.Screen name="Save notes" component={SaveScreen} />
                <Drawer.Screen name="Open different file" component={OpenScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    )
}
