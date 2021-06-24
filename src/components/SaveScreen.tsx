import React from 'react'
import { View } from 'react-native'
import { CheckBox, Input } from 'react-native-elements'
import { useNavigationState } from '@react-navigation/native'
import { FSConstants } from '../filesystem/constants'
import { sanitizeFileName } from '../filesystem/names'
import { updateSaveFileStatus } from '../redux/actions'
import { LoadingStatus } from '../redux/loadingStatus'
import { StoreContext } from '../redux/store'
import { Strings } from '../strings/strings'
import { styles } from '../styles/styles'
import { FileShareButton } from './FileShareButton'
import { FileViewButton } from './FileViewButton'
import { SaveFileButton } from './SaveFileButton'
import { ScreenTemplate } from './ScreenTemplate'
import { P } from './textComponents'

export function SaveScreen(): JSX.Element {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus, saveExternalUri } = getState()
    const [fileName, setFileName] = React.useState('')
    const [withNotes, setWithNotes] = React.useState(false)

    // Hide previously saved file when user navigates away from this screen
    const currentIndex = useNavigationState((state) => state.index)
    const saveScreenIndex = useNavigationState(
        (state) => state.routeNames,
    ).indexOf(Strings.ScreenNameSave)
    React.useEffect(() => {
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }, [currentIndex === saveScreenIndex])

    // Hide previously saved file when user changes save inputs
    const cleanFileName = () => {
        setFileName(sanitizeFileName(fileName, true))
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }
    const updateWithNotes = (value: boolean) => {
        if (value === withNotes) return
        setWithNotes(value)
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }

    return (
        <ScreenTemplate title={Strings.ScreenNameSave}>
            <P>{Strings.SaveInclude}</P>
            <CheckBox
                title={Strings.SaveItemsAll}
                checked={!withNotes}
                onPress={() => updateWithNotes(false)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
            <CheckBox
                title={Strings.SaveItemsHavingNotes}
                checked={withNotes}
                onPress={() => updateWithNotes(true)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />

            <P>{Strings.SaveFileName}</P>
            <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                    <Input
                        value={fileName}
                        onChangeText={setFileName}
                        onBlur={cleanFileName}
                        onSubmitEditing={cleanFileName}
                        placeholder={FSConstants.FileNameDefault}
                    />
                </View>
                <View>
                    <P>.csv</P>
                </View>
            </View>

            <View style={{ marginBottom: 15 }}>
                <SaveFileButton
                    fileName={fileName}
                    itemsWithNotesOnly={withNotes}
                />
            </View>

            {saveFileStatus === LoadingStatus.Done && (
                <View style={styles.highlightSection}>
                    <P centered>
                        {saveExternalUri
                            ? Strings.SavedToDevice
                            : Strings.SavedTemporary}
                    </P>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <FileViewButton />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FileShareButton />
                        </View>
                    </View>
                </View>
            )}
        </ScreenTemplate>
    )
}
