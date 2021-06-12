import { FormValue } from '../../forms/forms'
import { updateNoteInput } from '../shared/actions'
import { Dispatch, GetState } from '../shared/store'

export function setNoteInput(index: number, value: FormValue) {
    return (dispatch: Dispatch, getState: GetState) => {
        const { noteInput } = getState()
        const newNoteInput = [...noteInput]
        newNoteInput[index] = value
        dispatch(updateNoteInput(newNoteInput))
    }
}
