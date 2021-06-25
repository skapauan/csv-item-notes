import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StoreProvider } from '../redux/store'
import { Main } from './main/Main'

export default function App(): JSX.Element {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" backgroundColor="black" />
            <StoreProvider>
                <Main />
            </StoreProvider>
        </SafeAreaProvider>
    )
}

registerRootComponent(App)
