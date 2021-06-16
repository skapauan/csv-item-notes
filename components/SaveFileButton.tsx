import React from 'react'
import { Button } from 'react-native-elements'
import { Strings } from '../strings/strings'
import { LoadingStatus } from './shared/loadingStatus'
import { StoreContext } from './shared/store'
import { saveFile } from './thunks/saveFile'

export interface SaveFileButtonProps { itemsWithNotesOnly?: boolean; }

export function SaveFileButton({ itemsWithNotesOnly }: SaveFileButtonProps) {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus } = getState()

    const isLoading = saveFileStatus === LoadingStatus.Loading

    const btnProps = {
        disabled: isLoading,
        onPress: () => dispatch(saveFile(itemsWithNotesOnly)),
        title: isLoading ? Strings.PleaseWait : Strings.ButtonSave,
        type: (saveFileStatus === LoadingStatus.Done
            ? 'outline' : 'solid') as ('solid' | 'outline'),
    }

    return <Button {...btnProps} />
}
