import { cacheDirectory } from 'expo-file-system'
import { FSConstants } from './constants'

let count = 0

export function getId () {
    return count++
}

export function getTempFile(id: number) {
    return (cacheDirectory || '') + FSConstants.TempFilePrefix + id + '.csv'
}
