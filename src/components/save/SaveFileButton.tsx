import React from 'react'
import { Button } from 'react-native-elements'
import { LoadingStatus } from '../../redux/loadingStatus'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'
import { saveFile } from '../../thunks/saveFile'

export interface SaveFileButtonProps {
    fileName: string
    itemsWithNotesOnly?: boolean
}

export function SaveFileButton({
    fileName,
    itemsWithNotesOnly,
}: SaveFileButtonProps): JSX.Element {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus } = getState()

    const onPress = () => dispatch(saveFile(fileName, itemsWithNotesOnly))

    let disabled = false,
        title = Strings.ButtonSave,
        type = 'outline' as 'outline' | 'solid'
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
