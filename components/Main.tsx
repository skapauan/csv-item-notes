import React from 'react'
import { Intro } from './Intro'
import { Loading } from './Loading'
import { MainNavigation } from './MainNavigation'
import { LoadingStatus } from './shared/loadingStatus'
import { StoreContext } from './shared/store'
import { checkDataStatus } from './thunks/checkDataStatus'

export function Main() {
    const { dispatch, getState } = React.useContext(StoreContext)

    // When app starts, check if DB has data
    React.useEffect(() => dispatch(checkDataStatus()), [])

    switch (getState().dataStatus) {
        case LoadingStatus.Done:
            return <MainNavigation />
        case LoadingStatus.Unstarted:
            return <Intro />
        case LoadingStatus.Loading:
        default:
            return <Loading />
    }
}
