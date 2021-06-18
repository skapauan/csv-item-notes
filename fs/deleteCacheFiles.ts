import * as FileSystem from 'expo-file-system'
import { FSConstants } from './constants'
import { createCacheDirectory } from './createCacheDirectory'

export async function deleteCacheFiles() {
    const cacheFolder = FSConstants.CacheFolder

    // Check if directory exists
    const dirInfo = await FileSystem.getInfoAsync(cacheFolder)
    const { exists, isDirectory } = dirInfo

    // Delete directory contents if it exists
    if (exists && isDirectory) {
        await FileSystem.deleteAsync(cacheFolder, { idempotent: true })
        await FileSystem.makeDirectoryAsync(cacheFolder, { intermediates: true })
    }

    // Create directory if it does not exist
    await createCacheDirectory(dirInfo)

}
