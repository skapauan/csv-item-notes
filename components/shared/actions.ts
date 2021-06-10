import { ItemColumn } from '../../db/types'
import { Item } from './store'

// Action types

export const ActionTypes = {
    UpdateDataStatus: 'UpdateDataStatus',
    UpdateFieldEditStatus: 'UpdateFieldEditStatus',
    UpdateNoteFields: 'UpdateNoteFields',
    UpdateOpenFileProgress: 'UpdateOpenFileProgress',
    UpdateViewedItem: 'UpdateViewedItem',
    UpdateViewedError: 'UpdateViewedError',
}

// Action creators

export const updateDataStatus = (payload: number) => ({
    type: ActionTypes.UpdateDataStatus,
    payload,
})

export const updateFieldEditStatus = (payload: ItemColumn | boolean) => ({
    type: ActionTypes.UpdateFieldEditStatus,
    payload,
})

export const updateNoteFields = (payload: ItemColumn[]) => ({
    type: ActionTypes.UpdateNoteFields,
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
