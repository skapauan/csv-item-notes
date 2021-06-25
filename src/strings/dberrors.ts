import { DBErrors } from '../database/errors'
import { Strings } from './strings'

export function getItemDataErrorMessage(error: Error): string {
    switch (error.message) {
        case DBErrors.INVALID_FIELD_VARIANCE:
            return Strings.ErrorInvalidFieldVariance
        case DBErrors.INVALID_NUMBER_COLUMNS:
            return Strings.ErrorInvalidNumberColumns
        case DBErrors.INVALID_NUMBER_ROWS:
            return Strings.ErrorInvalidNumberRows
        default:
            return Strings.ErrorDatabase + error.message
    }
}
