import * as FileSystem from 'expo-file-system'
import { FSConstants } from './constants'

export async function createCacheDirectory(
    dirInfo?: FileSystem.FileInfo,
): Promise<void> {
    const cacheFolder = FSConstants.CacheFolder

    // Check if directory exists
    if (!dirInfo) dirInfo = await FileSystem.getInfoAsync(cacheFolder)
    const { exists, isDirectory } = dirInfo

    // Create directory if it does not exist
    if (exists && !isDirectory) {
        await FileSystem.deleteAsync(cacheFolder, { idempotent: true })
    }
    if (!exists || !isDirectory) {
        await FileSystem.makeDirectoryAsync(cacheFolder, {
            intermediates: true,
        })
    }
}
