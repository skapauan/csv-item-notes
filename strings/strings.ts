import LocalizedStrings from 'localized-strings'
import * as Localization from 'expo-localization'

export const Strings = new LocalizedStrings({
    en: {
        ButtonCancel: 'Cancel',
        ButtonSave: 'Save',
        OpenFileButton: 'Choose CSV file',
        OpenFileInstructions:
            'This will replace all your current data and notes in the app, so'
            + ' please save a file first if you wish to keep them.',
        FieldAddButton: 'Add Note Field',
        FieldDefaultTitle: 'Note ',
        FieldModifyFailed: 'Failed to modify note field',
        FieldTitle: 'Field title:',
        FieldType: 'Field type:',
        FieldTypeBoolean: 'Checkbox',
        FieldTypeNumeric: 'Number',
        FieldTypeText: 'Text',
        FileRequirements: 'CSV file requirements:',
        FileRequirement1:
            'The first row must contain titles for the columns.',
        FileRequirement2:
            'The first column must contain unique ID numbers for each item.',
        FileRequirement3:
            'There must be at least one row of data.',
        Error: 'Error',
        ErrorInvalidNumberRows:
            'Invalid CSV: At least one row of data is required, not including'
            + ' the header row',
        ErrorInvalidNumberColumns:
            'Invalid CSV: At least one column of data is required',
        ErrorInvalidFieldVariance:
            'Invalid CSV: All rows must have same number of fields',
        ErrorUnknown: 'Unknown Error',
        IntroInstructions: 'To begin, choose a CSV file from your device.',
        ItemIdPlaceholder: 'Type item ID here',
        ItemNotFound: 'Item not found',
        ItemUnexpectedError: 'Unexpected database error. Please restart app.',
        LoadFileCanceled: 'File selection was canceled',
        LoadFileDone: 'Done loading data from file',
        LoadFileInfo: 'File name: %\r\nFile size: % bytes\r\nNumber of rows: %\r\nTime to load: % seconds',
        LoadFileError: 'Error loading file',
        Loading: 'Loading...',
        Notes: 'Notes',
        NothingHere: 'Nothing here yet!',
        ScreenNameView: 'View Current Data',
        ScreenNameFields: 'Configure Note Fields',
        ScreenNameSave: 'Save As File',
        ScreenNameOpen: 'Open File',
        ScreenNameSettings: 'Settings',
        ViewScreenInstructions: 'Enter an item ID above to view its info.',
    }
})
Strings.setLanguage(Localization.locale)
