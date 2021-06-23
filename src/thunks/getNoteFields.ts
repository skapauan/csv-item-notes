import { dbi } from '../database/dbInstance'
import { updateNoteFields } from '../redux/actions'
import { Dispatch, Thunk } from '../redux/store'

export function getNoteFields(): Thunk {
    return (dispatch: Dispatch) => {
        const noteFields = dbi.itemColumns
            .filter((col) => !!col.isNote)
            .sort((colA, colB) => {
                const a = colA.order
                const b = colB.order
                if (typeof a === 'number') {
                    if (typeof b === 'number')
                        return a === b ? 0 : a < b ? -1 : 1
                    else return -1
                } else {
                    if (typeof b === 'number') return 1
                    else return 0
                }
            })
        dispatch(updateNoteFields(noteFields))
    }
}
