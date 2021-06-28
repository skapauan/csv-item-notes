// Use React context to imitate Redux store with thunk middleware

import React from 'react'
import useThunkReducer, {
    Thunk as PackageThunk,
} from 'react-hook-thunk-reducer'
import { ItemColumn, ItemOutput } from '../database/types'
import { FormValue, getFormValue } from '../forms/forms'
import { Action, ActionType } from './actions'
import { LoadingStatus } from './loadingStatus'

export interface StoreProviderProps {
    children: React.ReactNode
}
export type Thunk = PackageThunk<State, Action>
export type Dispatch = React.Dispatch<Action | Thunk>
export type GetState = () => State
export interface State {
    dataFields: ItemColumn[]
    dataStatus: LoadingStatus
    fieldEdit: ItemColumn | boolean
    noteFields: ItemColumn[]
    noteInput: FormValue[]
    openFileProgress: number
    saveFileStatus: LoadingStatus
    saveExternalUri: string
    saveInternalUri: string
    viewedEmptyId: string
    viewedError: string
    viewedItem: ItemOutput | undefined
}
const initialState: State = {
    dataFields: [],
    dataStatus: LoadingStatus.Loading,
    fieldEdit: false,
    noteFields: [],
    noteInput: [],
    openFileProgress: -1,
    saveFileStatus: LoadingStatus.Unstarted,
    saveExternalUri: '',
    saveInternalUri: '',
    viewedEmptyId: '',
    viewedError: '',
    viewedItem: undefined,
}

export const StoreProvider = (props: StoreProviderProps): JSX.Element => {
    const [state, dispatch] = useThunkReducer(
        (state: State, action: Action): State => {
            switch (action.type) {
                case ActionType.DataFields:
                    return { ...state, dataFields: action.payload }
                case ActionType.DataStatus:
                    return { ...state, dataStatus: action.payload }
                case ActionType.FieldEdit:
                    return { ...state, fieldEdit: action.payload }
                case ActionType.NoteFields:
                    return { ...state, noteFields: action.payload }
                case ActionType.NoteInput:
                    return { ...state, noteInput: action.payload }
                case ActionType.OpenFileProgress:
                    return { ...state, openFileProgress: action.payload }
                case ActionType.SaveFileStatus:
                    const saveFileStatus = action.payload
                    if (saveFileStatus === LoadingStatus.Unstarted) {
                        return {
                            ...state,
                            saveFileStatus,
                            saveExternalUri: '',
                            saveInternalUri: '',
                        }
                    }
                    return { ...state, saveFileStatus }
                case ActionType.SaveExternalUri:
                    return { ...state, saveExternalUri: action.payload }
                case ActionType.SaveInternalUri:
                    return { ...state, saveInternalUri: action.payload }
                case ActionType.ViewedEmptyId:
                    return { ...state, viewedEmptyId: action.payload }
                case ActionType.ViewedError:
                    return { ...state, viewedError: action.payload }
                case ActionType.ViewedItem:
                    const viewedItem = action.payload
                    if (viewedItem) {
                        const { noteFields } = state
                        const noteInput = noteFields.map(({ index, type }) =>
                            getFormValue(
                                viewedItem.itemColumnValues[index],
                                type,
                            ),
                        )
                        return { ...state, noteInput, viewedItem }
                    }
                    return { ...state, viewedItem }
                default:
                    return state
            }
        },
        initialState,
    )
    const getState = () => state
    return (
        <StoreContext.Provider value={{ dispatch, getState }}>
            {props.children}
        </StoreContext.Provider>
    )
}

export const StoreContext = React.createContext({
    dispatch: (_: Action | Thunk): void => undefined, // eslint-disable-line @typescript-eslint/no-unused-vars
    getState: (): State => initialState,
})
