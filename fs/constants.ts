import { cacheDirectory } from 'expo-file-system'

const cacheDir = cacheDirectory || ''

export const FSConstants = {
    OutputFile: cacheDir + 'CsvItemNotes.csv',
    CsvMimeType: 'text/comma-separated-values',
    CsvUti: 'public.comma-separated-values-text',
    TempFilePrefix: cacheDir + 'temp_',
    TempFileSuffix: '.csv',
}
