import React from 'react'
import { View, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { useNavigationState } from '@react-navigation/native'
import { TopBar } from './TopBar'
import { StoreContext } from './shared/store'
import { styles } from './shared/styles'
import { P } from './shared/textComponents'
import { Strings } from '../strings/strings'
import { FileShareButton } from './FileShareButton'
import { FileViewButton } from './FileViewButton'
import { SaveFileButton } from './SaveFileButton'
import { updateSaveFileId, updateSaveFileStatus } from './shared/actions'
import { LoadingStatus } from './shared/loadingStatus'

export function SaveScreen() {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { saveFileStatus } = getState()
    const [ withNotes, setWithNotes ] = React.useState(false)

    // Forget any saved file when user navigates away from this screen
    const currentIndex = useNavigationState(state => state.index)
    const saveScreenIndex = useNavigationState(state => state.routeNames)
        .indexOf(Strings.ScreenNameSave)
    React.useEffect(() => {
        dispatch(updateSaveFileId(-1))
        dispatch(updateSaveFileStatus(LoadingStatus.Unstarted))
    }, [currentIndex === saveScreenIndex])

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
                <P>{Strings.SaveScreenInstructions}</P>
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
                <View style={{ marginVertical: 15 }}>
                    <SaveFileButton itemsWithNotesOnly={withNotes} />
                </View>
                { saveFileStatus === LoadingStatus.Done &&
                <View style={{flexDirection: 'row' }}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <FileViewButton />
                    </View>
                    <View style={{flex: 1}}>
                        <FileShareButton />
                    </View>
                </View>
                }
            </ScrollView>
        </View>
    )
}
