import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { StoreProvider } from './components/shared/store'
import { Main } from './components/Main'

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <StoreProvider>
                <Main />
            </StoreProvider>
        </SafeAreaProvider>
    )
}
