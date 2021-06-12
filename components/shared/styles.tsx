import { StyleSheet } from 'react-native'
import { colors } from 'react-native-elements'
import Constants from 'expo-constants'
import tinycolor from 'tinycolor2'

const textInputPadding = 12
const titleFontSize = 24
const topBarHeight = 50
const bodyFontSize = 20
const bodyPadTop = 8
const bodyPadBottom = 20
const bodyPadHorizontal = 18
const bodyTextMarginVertical = 6
const bodyTextIndent = 15

const themePrimary = tinycolor(colors.primary).toRgbString()
const themeBg = tinycolor(colors.primary).setAlpha(0.2).toRgbString()
const bodyBackground = 'white'
const bodyColorRegular = colors.grey0
const bodyColorHeader = colors.grey0
const topBackground = themeBg
const topColor = colors.grey0
export const topIconColor = themePrimary

export const styles = StyleSheet.create({
    outerView: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
    },
    iconButton: {
        width: 50,
        height: 50,
        padding: 6,
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor: topBackground,
        height: topBarHeight,
    },
    topSearch: {
        flex: 1,
        flexDirection: 'row',
    },
    topSearchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: textInputPadding,
        fontSize: titleFontSize,
    },
    topSearchButton: {
        height: 50,
        width: 50,
        padding: 10
    },
    topTitle: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: titleFontSize,
        color: topColor,
    },
    body: {
        flex: 1,
        backgroundColor: bodyBackground,
        paddingHorizontal: bodyPadHorizontal,
        paddingTop: bodyPadTop,
        paddingBottom: bodyPadBottom,
    },
    bodyScrollOuterSolo: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: bodyBackground,
        paddingHorizontal: bodyPadHorizontal,
    },
    bodyScrollOuter: {
        flex: 1,
        backgroundColor: bodyBackground,
        paddingHorizontal: bodyPadHorizontal,
    },
    bodyScrollInner: {
        paddingTop: bodyPadTop,
        paddingBottom: bodyPadBottom,
    },
    bodyFont: {
        fontSize: bodyFontSize,
    },
    p: {
        marginVertical: bodyTextMarginVertical,
        fontSize: bodyFontSize,
        color: bodyColorRegular,
    },
    dt: {
        marginTop: bodyTextMarginVertical,
        fontSize: bodyFontSize,
        color: bodyColorHeader,
        fontWeight: 'bold',
    },
    dd: {
        fontSize: bodyFontSize,
        color: bodyColorRegular,
    },
    notesSheet: {
        backgroundColor: themeBg,
    },
    li_outer: {
        flexDirection: 'row',
        marginVertical: bodyTextMarginVertical,
    },
    li_bullet: {
        fontSize: bodyFontSize,
        color: bodyColorRegular,
    },
    li_inner: {
        flex: 1,
        paddingLeft: bodyTextIndent,
        fontSize: bodyFontSize,
        color: bodyColorRegular,
    },
    textInput: {
        color: bodyColorRegular,
        fontSize: bodyFontSize,
    },
})