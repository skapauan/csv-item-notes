
// Use React context to imitate Redux store with thunk middleware

import React from 'react'
import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { ActionTypes } from './actions'
import { DBValue } from '../../db/constants'

export interface Item { [key: string]: DBValue; }
export interface State { dataStatus: number; viewedItem: Item | undefined; }
export interface Action { type: string; payload: any; }
export interface StoreProviderProps { children: any; }
export type Dispatch = React.Dispatch<Action | Thunk<State, Action>>
export type GetState = () => State

const initialState: State = {
    dataStatus: -1,
    viewedItem: undefined,
}

export const StoreContext = React.createContext({
    dispatch: (actionOrThunk: Action | Thunk<State, Action>): void => {},
    getState: (): State => initialState,
})

export const StoreProvider = (props: StoreProviderProps) => {
    const [state, dispatch] = useThunkReducer(
        (state: State, action: Action): State => {
            switch (action.type) {
                case ActionTypes.UpdateDataStatus:
                    return {...state, dataStatus: action.payload}
                case ActionTypes.UpdateViewedItem:
                    return {...state, viewedItem: action.payload}
                default:
                    return state
            }
        },
        initialState
    )
    const getState = () => state
    return (
        <StoreContext.Provider value={{ dispatch, getState }}>
            {props.children}
        </StoreContext.Provider>
    )
}
