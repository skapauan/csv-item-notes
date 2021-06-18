import { cacheDirectory } from 'expo-file-system'

export const FSConstants = {
    CacheFolder: cacheDirectory || '',
    DownloadFolder: 'Download',
    FileNameDefault: 'CSVItemNotes',
    CsvExtension: '.csv',
    CsvMimeType: 'text/comma-separated-values',
    CsvUti: 'public.comma-separated-values-text',
}
