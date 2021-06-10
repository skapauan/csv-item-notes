import React from 'react'
import { ItemColumn } from '../db/types'
import { updateFieldEditStatus } from './shared/actions'
import { StoreContext } from './shared/store'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { OverlayTemplate } from './OverlayTemplate'

export type FieldEditOverlayProps = { field: ItemColumn }

export function FieldEditOverlay({ field }: FieldEditOverlayProps) {
    const { dispatch } = React.useContext(StoreContext)

    const onCancel = () => dispatch(updateFieldEditStatus(false))

    return (
        <OverlayTemplate isVisible={true} onCancel={onCancel} onSave={onCancel}>
            <P>{Strings.NothingHere}</P>
        </OverlayTemplate>
    )
}
