import { Item } from './store'

// Action types

export const ActionTypes = {
    UpdateDataStatus: 'UpdateDataStatus',
    UpdateViewedItem: 'UpdateViewedItem',
    UpdateViewedError: 'UpdateViewedError',
}

// Action creators

export const updateDataStatus = (status: number) => ({
    type: ActionTypes.UpdateDataStatus,
    payload: status,
})

export const updateViewedItem = (item: Item | undefined) => ({
    type: ActionTypes.UpdateViewedItem,
    payload: item,
})

export const updateViewedError = (message: string) => ({
    type: ActionTypes.UpdateViewedError,
    payload: message,
})