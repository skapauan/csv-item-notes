import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Main } from './components/Main'

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Main />
        </SafeAreaProvider>
    )
}
