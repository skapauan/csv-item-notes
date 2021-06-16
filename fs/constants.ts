import * as FileSystem from 'expo-file-system'

export const FSConstants = {
    OutputFile: FileSystem.cacheDirectory + 'CsvItemNotes.csv',
    CsvMimeType: 'text/comma-separated-values',
    CsvUti: 'public.comma-separated-values-text',
    TempFilePrefix: 'temp_'
}
