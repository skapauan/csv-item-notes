import { FormValue } from '../forms/forms'
import { updateNoteInput } from '../redux/actions'
import { Dispatch, GetState, Thunk } from '../redux/store'

export function setNoteInput(index: number, value: FormValue): Thunk {
    return (dispatch: Dispatch, getState: GetState) => {
        const { noteInput } = getState()
        const newNoteInput = [...noteInput]
        newNoteInput[index] = value
        dispatch(updateNoteInput(newNoteInput))
    }
}
