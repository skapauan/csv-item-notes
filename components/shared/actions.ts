import { ItemColumn, ItemOutput } from '../../db/types'
import { FormValue } from '../../forms/forms'

// Action types

export const ActionTypes = {
    UpdateDataStatus: 'UpdateDataStatus',
    UpdateFieldEditStatus: 'UpdateFieldEditStatus',
    UpdateNoteFields: 'UpdateNoteFields',
    UpdateNoteInput: 'UpdateNoteInput',
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

export const updateNoteInput = (payload: FormValue[]) => ({
    type: ActionTypes.UpdateNoteInput,
    payload,
})

export const updateOpenFileProgress = (payload: number) => ({
    type: ActionTypes.UpdateOpenFileProgress,
    payload,
})

export const updateViewedItem = (payload: ItemOutput | undefined) => ({
    type: ActionTypes.UpdateViewedItem,
    payload,
})

export const updateViewedError = (payload: string) => ({
    type: ActionTypes.UpdateViewedError,
    payload,
})
