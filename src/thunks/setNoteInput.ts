import { FormValue } from '../forms/forms'
import { updateNoteInput } from '../redux/actions'
import { Dispatch, GetState } from '../redux/store'

export function setNoteInput(index: number, value: FormValue) {
    return (dispatch: Dispatch, getState: GetState) => {
        const { noteInput } = getState()
        const newNoteInput = [...noteInput]
        newNoteInput[index] = value
        dispatch(updateNoteInput(newNoteInput))
    }
}
