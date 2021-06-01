import React from 'react'

export const Context = React.createContext({
    dataStatus: -1,
    setDataStatus: (status: number) => {}
})
