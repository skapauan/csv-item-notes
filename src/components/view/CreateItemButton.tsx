import React from 'react'
import { Alert, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker'
import { dbi } from '../../database/dbInstance'
import { StoreContext } from '../../redux/store'
import { Strings } from '../../strings/strings'
import { styles } from '../../styles/styles'
import { findItemById } from '../../thunks/findItemById'
import { OverlayTemplate } from '../screen/OverlayTemplate'
import { DT, P } from '../screen/textComponents'

export function CreateItemButton(): JSX.Element {
    const { dispatch, getState } = React.useContext(StoreContext)
    const { dataFields, viewedEmptyId } = getState()
    const [dataIndex, setDataIndex] = React.useState(1)
    const [inputs, setInputs] = React.useState(dataFields.map(() => ''))
    const [visible, setVisible] = React.useState(false)

    if (!viewedEmptyId) return <></>

    const pickerOptions = dataFields
        .filter((_, i) => i !== 0)
        .map((col, index) => (
            <Picker.Item
                key={index}
                value={index + 1}
                label={col.title || col.name}
            />
        ))
    const onPickerChange = (value: number) => {
        setDataIndex(value)
    }
    const onInputChange = (value: string) => {
        const values = [...inputs]
        values[dataIndex] = value
        setInputs(values)
    }
    const onCancel = () => {
        setVisible(false)
        setDataIndex(1)
    }
    const onSave = () => {
        dbi.createItems([[...inputs]])
            .then(() => {
                dispatch(findItemById())
                onCancel()
            })
            .catch((e) => {
                Alert.alert(Strings.Error, Strings.ItemCreateError + e.message)
            })
    }
    const onShow = () => {
        setInputs(dataFields.map((_, i) => (i === 0 ? viewedEmptyId : '')))
        setVisible(true)
    }
    const firstFieldTitle = dataFields[0].title || dataFields[0].name
    const createItemTitle = Strings.ItemCreate.replace(
        '%1',
        firstFieldTitle,
    ).replace('%2', viewedEmptyId)
    const dataTitle = dataFields[dataIndex].title || dataFields[dataIndex].name

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    onPress={onShow}
                    title={createItemTitle}
                    type="outline"
                />
            </View>
            <OverlayTemplate
                isVisible={visible}
                onCancel={onCancel}
                onSave={onSave}
            >
                <DT>{createItemTitle}</DT>
                {pickerOptions.length > 0 && (
                    <>
                        <P>{Strings.ItemCreateInstructions}</P>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                onValueChange={onPickerChange}
                                selectedValue={dataIndex}
                                style={styles.picker}
                            >
                                {pickerOptions}
                            </Picker>
                        </View>
                        <Input
                            value={inputs[dataIndex]}
                            onChangeText={onInputChange}
                            placeholder={Strings.ItemCreateValuePlaceholder.replace(
                                '%',
                                dataTitle,
                            )}
                        />
                    </>
                )}
            </OverlayTemplate>
        </>
    )
}
