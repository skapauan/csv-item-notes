import LocalizedStrings from 'localized-strings'
import * as Localization from 'expo-localization'

export const Strings = new LocalizedStrings({
    en: {
        OpenFileButton: 'Choose CSV file',
        OpenFileInstructions:
            'Opening a different CSV file will replace all your current data'
            + ' and notes in the app, so please save a file first if you wish'
            + ' to keep them.',
        FileRequirements: 'CSV file requirements:',
        FileRequirement1:
            'The first row must contain titles for the columns.',
        FileRequirement2:
            'The first column must contain unique ID numbers for each item.',
        FileRequirement3:
            'There must be at least one row of data.',
        DoneLoadingFile: 'Done loading data from file',
        ErrorInvalidNumberRows:
            'Invalid CSV: At least one row of data is required, not including'
            + ' the header row',
        ErrorInvalidNumberColumns:
            'Invalid CSV: At least one column of data is required',
        ErrorInvalidFieldVariance:
            'Invalid CSV: All rows must have same number of fields',
        ErrorUnknown: 'Unknown Error',
        IntroInstructions: 'To begin, choose a CSV file from your device.',
        ItemIdPlaceholder: 'Enter item ID here',
        Loading: 'Loading',
        ScreenNameView: 'View current data',
        ScreenNameSave: 'Save as file',
        ScreenNameOpen: 'Open different file',
        ScreenNameSettings: 'Settings',
    }
})
Strings.setLanguage(Localization.locale)
