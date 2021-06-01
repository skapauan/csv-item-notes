import { StyleSheet } from 'react-native'
import Constants from 'expo-constants'

const titleFontSize = 24
const topBarHeight = 50
const bodyFontSize = 20
const bodyPadTop = 8
const bodyPadBottom = 20
const bodyPadHorizontal = 18
const bodyTextMarginVertical = 6
const bodyTextIndent = 15

export const styles = StyleSheet.create({
    outerView: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
    },
    menuIcon: {
        backgroundColor: '#999999',
        width: 50,
        height: 50,
        padding: 5,
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor: '#AAAAAA',
        height: topBarHeight,
    },
    topSearchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 12,
        fontSize: 30
    },
    topTitle: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: titleFontSize,
    },
    body: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: bodyPadHorizontal,
        paddingTop: bodyPadTop,
        paddingBottom: bodyPadBottom,
    },
    bodyScrollOuterSolo: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: bodyPadHorizontal,
    },
    bodyScrollOuter: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: bodyPadHorizontal,
    },
    bodyScrollInner: {
        paddingTop: bodyPadTop,
        paddingBottom: bodyPadBottom,
    },
    p: {
        marginVertical: bodyTextMarginVertical,
        fontSize: bodyFontSize,
    },
    dt: {
        marginTop: bodyTextMarginVertical,
        fontSize: bodyFontSize,
        fontWeight: 'bold',
    },
    dd: {
        fontSize: bodyFontSize,
    },
    li_outer: {
        flexDirection: 'row',
        marginVertical: bodyTextMarginVertical,
    },
    li_bullet: {
        fontSize: bodyFontSize,
    },
    li_inner: {
        flex: 1,
        paddingLeft: bodyTextIndent,
        fontSize: bodyFontSize,
    },
})
