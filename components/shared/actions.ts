import { Item } from './store'

// Action types

export const ActionTypes = {
    UpdateDataStatus: 'UpdateDataStatus',
    UpdateOpenFileProgress: 'UpdateOpenFileProgress',
    UpdateViewedItem: 'UpdateViewedItem',
    UpdateViewedError: 'UpdateViewedError',
}

// Action creators

export const updateDataStatus = (payload: number) => ({
    type: ActionTypes.UpdateDataStatus,
    payload,
})

export const updateOpenFileProgress = (payload: number) => ({
    type: ActionTypes.UpdateOpenFileProgress,
    payload,
})

export const updateViewedItem = (payload: Item | undefined) => ({
    type: ActionTypes.UpdateViewedItem,
    payload,
})

export const updateViewedError = (payload: string) => ({
    type: ActionTypes.UpdateViewedError,
    payload,
})
