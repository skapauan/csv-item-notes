import { ItemColumn, ItemOutput } from '../database/types'
import { FormValue } from '../forms/forms'
import { LoadingStatus } from './loadingStatus'

interface A<T, P> {
    type: T
    payload: P
}

// Action types

export enum ActionType {
    DataFields,
    DataStatus,
    FieldEdit,
    NoteFields,
    NoteInput,
    OpenFileProgress,
    SaveExternalUri,
    SaveFileStatus,
    SaveInternalUri,
    ViewedEmptyId,
    ViewedError,
    ViewedItem,
}

export type Action =
    | ActionDataFields
    | ActionDataStatus
    | ActionFieldEdit
    | ActionNoteFields
    | ActionNoteInput
    | ActionOpenFileProgress
    | ActionSaveExternalUri
    | ActionSaveFileStatus
    | ActionSaveInternalUri
    | ActionViewedEmptyId
    | ActionViewedError
    | ActionViewedItem

// Action creators returning actions

export type ActionDataFields = A<ActionType.DataFields, ItemColumn[]>
export const updateDataFields = (payload: ItemColumn[]): ActionDataFields => ({
    type: ActionType.DataFields,
    payload,
})

export type ActionDataStatus = A<ActionType.DataStatus, LoadingStatus>
export const updateDataStatus = (payload: LoadingStatus): ActionDataStatus => ({
    type: ActionType.DataStatus,
    payload,
})

export type ActionFieldEdit = A<ActionType.FieldEdit, ItemColumn | boolean>
export const updateFieldEdit = (
    payload: ItemColumn | boolean,
): ActionFieldEdit => ({
    type: ActionType.FieldEdit,
    payload,
})

export type ActionNoteFields = A<ActionType.NoteFields, ItemColumn[]>
export const updateNoteFields = (payload: ItemColumn[]): ActionNoteFields => ({
    type: ActionType.NoteFields,
    payload,
})

export type ActionNoteInput = A<ActionType.NoteInput, FormValue[]>
export const updateNoteInput = (payload: FormValue[]): ActionNoteInput => ({
    type: ActionType.NoteInput,
    payload,
})

export type ActionOpenFileProgress = A<ActionType.OpenFileProgress, number>
export const updateOpenFileProgress = (
    payload: number,
): ActionOpenFileProgress => ({
    type: ActionType.OpenFileProgress,
    payload,
})

export type ActionSaveFileStatus = A<ActionType.SaveFileStatus, LoadingStatus>
export const updateSaveFileStatus = (
    payload: LoadingStatus,
): ActionSaveFileStatus => ({
    type: ActionType.SaveFileStatus,
    payload,
})

export type ActionSaveExternalUri = A<ActionType.SaveExternalUri, string>
export const updateSaveExternalUri = (
    payload: string,
): ActionSaveExternalUri => ({
    type: ActionType.SaveExternalUri,
    payload,
})

export type ActionSaveInternalUri = A<ActionType.SaveInternalUri, string>
export const updateSaveInternalUri = (
    payload: string,
): ActionSaveInternalUri => ({
    type: ActionType.SaveInternalUri,
    payload,
})

export type ActionViewedEmptyId = A<ActionType.ViewedEmptyId, string>
export const updateViewedEmptyId = (payload: string): ActionViewedEmptyId => ({
    type: ActionType.ViewedEmptyId,
    payload,
})

export type ActionViewedError = A<ActionType.ViewedError, string>
export const updateViewedError = (payload: string): ActionViewedError => ({
    type: ActionType.ViewedError,
    payload,
})

export type ActionViewedItem = A<ActionType.ViewedItem, ItemOutput | undefined>
export const updateViewedItem = (
    payload: ItemOutput | undefined,
): ActionViewedItem => ({
    type: ActionType.ViewedItem,
    payload,
})
