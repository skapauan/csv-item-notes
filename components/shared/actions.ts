import { Item } from './store'

// Action types

export const ActionTypes = {
    UpdateDataStatus: 'UpdateDataStatus',
    UpdateViewedItem: 'UpdateViewedItem',
}

// Action creators

export const updateDataStatus = (status: number) => ({
    type: ActionTypes.UpdateDataStatus,
    payload: status,
})

export const updateViewedItem = (item: Item) => ({
    type: ActionTypes.UpdateViewedItem,
    payload: item,
})
