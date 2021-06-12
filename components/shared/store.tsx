
// Use React context to imitate Redux store with thunk middleware

import React from 'react'
import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { ItemColumn, ItemOutput } from '../../db/types'
import { ActionTypes } from './actions'
import { FormValue, getFormValue } from '../../forms/forms'

export interface Action { type: string; payload: any; }
export interface StoreProviderProps { children: any; }
export type Dispatch = React.Dispatch<Action | Thunk<State, Action>>
export type GetState = () => State
export interface State {
    dataStatus: number;
    fieldEditStatus: ItemColumn | boolean;
    fileSaved: boolean;
    noteFields: ItemColumn[];
    noteInput: FormValue[];
    openFileProgress: number;
    viewedItem: ItemOutput | undefined;
    viewedError: string;
}
const initialState: State = {
    dataStatus: -1,
    fieldEditStatus: false,
    fileSaved: false,
    noteFields: [],
    noteInput: [],
    openFileProgress: -1,
    viewedItem: undefined,
    viewedError: '',
}

export const StoreProvider = (props: StoreProviderProps) => {
    const [state, dispatch] = useThunkReducer(
        (state: State, action: Action): State => {
            switch (action.type) {
                case ActionTypes.UpdateDataStatus:
                    return {...state, dataStatus: action.payload}
                case ActionTypes.UpdateFieldEditStatus:
                    return {...state, fieldEditStatus: action.payload}
                case ActionTypes.UpdateFileSaved:
                    return {...state, fileSaved: action.payload}
                case ActionTypes.UpdateNoteFields:
                    return {...state, noteFields: action.payload}
                case ActionTypes.UpdateNoteInput:
                    return {...state, noteInput: action.payload}
                case ActionTypes.UpdateOpenFileProgress:
                    return {...state, openFileProgress: action.payload}
                case ActionTypes.UpdateViewedItem:
                    const viewedItem = action.payload as ItemOutput
                    if (viewedItem) {
                        const { noteFields } = state
                        const noteInput = noteFields.map(
                            ({ index, type }) => getFormValue(
                                viewedItem.itemColumnValues[index], type)
                        )
                        return {...state, noteInput, viewedItem }
                    }
                    return {...state, viewedItem }
                case ActionTypes.UpdateViewedError:
                    return {...state, viewedError: action.payload}
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

export const StoreContext = React.createContext({
    dispatch: (actionOrThunk: Action | Thunk<State, Action>): void => {},
    getState: (): State => initialState,
})
