import React from 'react'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { LoadingStatus } from './shared/loadingStatus'
import { StoreContext } from './shared/store'
import { saveFile } from './thunks/saveFile'

export interface SaveFileButtonProps {
    fileName: string;
    itemsWithNotesOnly?: boolean;
}

export function SaveFileButton({ fileName, itemsWithNotesOnly }
: SaveFileButtonProps) {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus, saveExternalUri } = getState()

    const onPress = () => dispatch(saveFile(fileName, itemsWithNotesOnly))

    let disabled = false,
        title = Strings.ButtonSave,
        type = 'outline' as ('outline' | 'solid')
    switch (saveFileStatus) {
        case LoadingStatus.Unstarted:
            type = 'solid'
            break
        case LoadingStatus.Loading:
            disabled = true
            title = Strings.PleaseWait
            break
        case LoadingStatus.Done:
            break
    }

    const btnProps = { disabled, onPress, title, type }

    return <Button {...btnProps} />
}
