import { DBConstants } from './constants'

export const getDataColName = (index: number) => DBConstants.Items.DataPrefix + index

export const getNoteColName = (index: number) => DBConstants.Items.NotePrefix + index
