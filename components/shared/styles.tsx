import { StyleSheet } from 'react-native'
import Constants from 'expo-constants'

const bodyFontSize = 24
const bodyTextMarginHorizontal = 12
const bodyTextMarginTop = 6

export const styles = StyleSheet.create({
    outerView: {
        marginTop: Constants.statusBarHeight,
        flexDirection: 'column',
        height: '100%'
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor: '#AAAAAA',
        height: 50,
    },
    menuIcon: {
        backgroundColor: '#999999',
        width: 50,
        height: 50,
        padding: 5,
    },
    topSearchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 12,
        fontSize: 30
    },
    body: {
        backgroundColor: '#EEEEEE',
        flex: 1,
    },
    p: {
        marginTop: bodyTextMarginTop,
        marginHorizontal: bodyTextMarginHorizontal,
        fontSize: bodyFontSize,
    },
    dt: {
        marginTop: bodyTextMarginTop,
        marginHorizontal: bodyTextMarginHorizontal,
        fontSize: bodyFontSize,
        fontWeight: 'bold',
    },
    dd: {
        marginHorizontal: bodyTextMarginHorizontal,
        fontSize: bodyFontSize,
    },
})
