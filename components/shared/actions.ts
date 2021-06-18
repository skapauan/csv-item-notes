import { ItemColumn, ItemOutput } from '../../db/types'
import { FormValue } from '../../forms/forms'
import { LoadingStatus } from './loadingStatus'

// Action types

export enum ActionTypes {
    UpdateDataStatus,
    UpdateFieldEditStatus,
    UpdateNoteFields,
    UpdateNoteInput,
    UpdateOpenFileProgress,
    UpdateSaveFileStatus,
    UpdateSaveExternalUri,
    UpdateSaveInternalUri,
    UpdateViewedItem,
    UpdateViewedError,
}

// Action creators

export const updateDataStatus = (payload: LoadingStatus) => ({
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

export const updateSaveFileStatus = (payload: LoadingStatus) => ({
    type: ActionTypes.UpdateSaveFileStatus,
    payload,
})

export const updateSaveExternalUri = (payload: string) => ({
    type: ActionTypes.UpdateSaveExternalUri,
    payload,
})

export const updateSaveInternalUri = (payload: string) => ({
    type: ActionTypes.UpdateSaveInternalUri,
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
