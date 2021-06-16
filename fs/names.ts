import { FSConstants } from './constants'

let count = 0

export function getId () {
    return count++
}

export function getTempFile(id: number) {
    return FSConstants.TempFilePrefix + id + FSConstants.TempFileSuffix
}
