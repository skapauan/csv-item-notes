import LocalizedStrings from 'localized-strings'
import * as Localization from 'expo-localization'

export const Strings = new LocalizedStrings({
    en: {
        ErrorInvalidNumberRows: 'Invalid CSV: At least one row of data is required, not including the header row',
        ErrorInvalidNumberColumns: 'Invalid CSV: At least one column of data is required',
        ErrorInvalidFieldVariance: 'Invalid CSV: All rows must have same number of fields',
        ErrorUnknown: 'Unknown Error',
    }
})
Strings.setLanguage(Localization.locale)
