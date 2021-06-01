import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Intro } from './Intro'
import { Loading } from './Loading'
import { MainNavigation } from './MainNavigation'
import { Context } from './Context'
import { dbi } from '../db/dbInstance'

const Drawer = createDrawerNavigator()

export function Main() {
    const [dataStatus, setDataStatus] = React.useState(-1)
    React.useEffect(() => {
        // When app starts, check if DB has data
        dbi.init()
        .then(() => setDataStatus(1))
        .catch((e) => setDataStatus(0))
    }, [])

    let content
    switch (dataStatus) {
        case -1:
            content = <Loading />
            break
        case 0:
            content = <Intro />
            break
        case 1:
            content = <MainNavigation />
            break
    }

    return (
        <Context.Provider value={{ dataStatus, setDataStatus }}>
            {content}
        </Context.Provider>
    )
}
