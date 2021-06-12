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
import { updateFileSaved } from './shared/actions'

export function SaveScreen() {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { fileSaved } = getState()
    const [ withNotes, setWithNotes ] = React.useState(false)

    // Forget any saved file when user navigates away from this screen
    const currentIndex = useNavigationState(state => state.index)
    const saveScreenIndex = useNavigationState(state => state.routeNames)
        .indexOf(Strings.ScreenNameSave)
    React.useEffect(() => {
        dispatch(updateFileSaved(false))
    }, [currentIndex === saveScreenIndex])

    const toggleCheckbox = () => {
        setWithNotes(!withNotes)
        dispatch(updateFileSaved(false))
    }

    return (
        <View style={styles.outerView}>
            <TopBar title={Strings.ScreenNameSave} />
            <ScrollView style={styles.bodyScrollOuter}
                    contentContainerStyle={styles.bodyScrollInner}>
                <P>{Strings.SaveScreenInstructions}</P>
                <CheckBox
                    title={Strings.SaveItemsHavingNotes}
                    checked={withNotes}
                    onPress={toggleCheckbox}
                    />
                <SaveFileButton itemsWithNotesOnly={withNotes} />
                { fileSaved &&
                <View style={{flexDirection: 'row', paddingTop: 15}}>
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
