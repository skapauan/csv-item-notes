import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

export const pickFileGetString = async (pickerOptions: DocumentPicker.DocumentPickerOptions) => {
    try {
        const document = await DocumentPicker.getDocumentAsync(pickerOptions)
        if (document.type !== 'success') {
            return Promise.reject(new Error('File selection was canceled'))
        }
        //TODO check device storage and/or enforce any file size limits here
        const fileContent = await FileSystem.readAsStringAsync(document.uri)
        //TODO delete local files not needed anymore
        return fileContent
    } catch (error) {
        return Promise.reject(error)
    }
}
