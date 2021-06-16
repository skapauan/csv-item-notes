
// Use React context to imitate Redux store with thunk middleware

import React from 'react'
import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { ItemColumn, ItemOutput } from '../../db/types'
import { ActionTypes } from './actions'
import { FormValue, getFormValue } from '../../forms/forms'
import { LoadingStatus } from './loadingStatus'

export interface Action { type: ActionTypes; payload: any; }
export interface StoreProviderProps { children: any; }
export type Dispatch = React.Dispatch<Action | Thunk<State, Action>>
export type GetState = () => State
export interface State {
    dataStatus: LoadingStatus;
    fieldEditStatus: ItemColumn | boolean;
    noteFields: ItemColumn[];
    noteInput: FormValue[];
    openFileProgress: number;
    saveFileId: number;
    saveFileStatus: LoadingStatus;
    viewedItem: ItemOutput | undefined;
    viewedError: string;
}
const initialState: State = {
    dataStatus: LoadingStatus.Loading,
    fieldEditStatus: false,
    noteFields: [],
    noteInput: [],
    openFileProgress: -1,
    saveFileId: -1,
    saveFileStatus: LoadingStatus.Unstarted,
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
                case ActionTypes.UpdateNoteFields:
                    return {...state, noteFields: action.payload}
                case ActionTypes.UpdateNoteInput:
                    return {...state, noteInput: action.payload}
                case ActionTypes.UpdateOpenFileProgress:
                    return {...state, openFileProgress: action.payload}
                case ActionTypes.UpdateSaveFileId:
                    return {...state, saveFileId: action.payload}
                case ActionTypes.UpdateSaveFileStatus:
                    return {...state, saveFileStatus: action.payload}
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
