import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StoreProvider } from '../redux/store'
import { Main } from './Main'

export default function App() {
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
