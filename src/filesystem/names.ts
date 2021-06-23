import sanitize from 'sanitize-filename'
import { FSConstants } from './constants'

export function getInternalUri(fileName: string): string {
    return FSConstants.CacheFolder + fileName + FSConstants.CsvExtension
}

export function sanitizeFileName(
    fileName: string,
    allowEmptyString = false,
): string {
    const fallback = allowEmptyString ? '' : FSConstants.FileNameDefault
    return typeof fileName === 'string'
        ? sanitize(fileName.trim()) || fallback
        : fallback
}
