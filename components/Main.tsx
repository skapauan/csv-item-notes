import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Intro } from './Intro'
import { Loading } from './Loading'
import { MainNavigation } from './MainNavigation'
import { StoreContext } from './shared/store'
import { checkDataStatus } from './thunks/checkDataStatus'

const Drawer = createDrawerNavigator()

export function Main() {
    const { dispatch, getState } = React.useContext(StoreContext)

    // When app starts, check if DB has data and display appropriate screen
    React.useEffect(() => dispatch(checkDataStatus()), [])

    switch (getState().dataStatus) {
        case 1:
            return <MainNavigation />
        case 0:
            return <Intro />
        default:
            return <Loading />
    }
}
