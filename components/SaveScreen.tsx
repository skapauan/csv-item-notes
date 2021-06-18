import React from 'react'
import { View, ScrollView, Platform } from 'react-native'
import { Card, CheckBox, Input } from 'react-native-elements'
import { useNavigationState } from '@react-navigation/native'
import { FSConstants } from '../fs/constants'
import { updateSaveExternalUri, updateSaveFileStatus, updateSaveInternalUri } from './shared/actions'
import { LoadingStatus } from './shared/loadingStatus'
import { StoreContext } from './shared/store'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { FileShareButton } from './FileShareButton'
import { FileViewButton } from './FileViewButton'
import { SaveFileButton } from './SaveFileButton'
import { TopBar } from './TopBar'
import { sanitizeFileName } from '../fs/names'

export function SaveScreen() {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus, saveExternalUri } = getState()
    const [ fileName, setFileName ] = React.useState(FSConstants.FileNameDefault)
    const [ withNotes, setWithNotes ] = React.useState(false)

    // Forget any saved file when user navigates away from this screen
    const currentIndex = useNavigationState(state => state.index)
    const saveScreenIndex = useNavigationState(state => state.routeNames)
        .indexOf(Strings.ScreenNameSave)
    React.useEffect(() => {
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
        dispatch(updateSaveExternalUri(''))
        dispatch(updateSaveInternalUri(''))
    }, [currentIndex === saveScreenIndex])

    const cleanFileName = () => {
        setFileName(sanitizeFileName(fileName, true))
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }
    const updateWithNotes = (value: boolean) => {
        if (value === withNotes) return
        setWithNotes(!withNotes)
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }

    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSave} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>

                <P>{Strings.SaveInclude}</P>
                <CheckBox
                    title={Strings.SaveItemsAll}
                    checked={!withNotes}
                    onPress={() => updateWithNotes(false)}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    />
                <CheckBox
                    title={Strings.SaveItemsHavingNotes}
                    checked={withNotes}
                    onPress={() => updateWithNotes(true)}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    />

                <P>{Strings.SaveFileName}</P>
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Input value={fileName}
                            onChangeText={setFileName}
                            onBlur={cleanFileName}
                            onSubmitEditing={cleanFileName}
                            placeholder={FSConstants.FileNameDefault} />
                    </View>
                    <View>
                        <P>.csv</P>
                    </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                    <SaveFileButton
                        fileName={fileName}
                        itemsWithNotesOnly={withNotes} />
                </View>

                { saveFileStatus === LoadingStatus.Done &&
                <View style={styles.highlightSection}>
                    <P centered>{ saveExternalUri
                        ? Strings.SavedToDevice
                        : Strings.SavedTemporary }</P>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{flex: 1, marginRight: 10}}>
                            <FileViewButton />
                        </View>
                        <View style={{flex: 1}}>
                            <FileShareButton />
                        </View>
                    </View>
                </View>
                }

            </ScrollView>
        </View>
    )
}
