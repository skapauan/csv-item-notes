import { cacheDirectory } from 'expo-file-system'

export const FSConstants = {
    CacheFolder: (cacheDirectory || '') + 'temp-save-files/',
    DownloadFolder: 'Download',
    FileNameDefault: 'CSVItemNotes',
    CsvExtension: '.csv',
    CsvMimeType: 'text/comma-separated-values',
    CsvUti: 'public.comma-separated-values-text',
}
