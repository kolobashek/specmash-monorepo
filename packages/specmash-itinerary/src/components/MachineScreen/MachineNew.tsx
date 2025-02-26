import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IMachine } from '../../store/machinesStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { MachinesStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { MachineForm } from './MachineForm'

type Props = StackScreenProps<MachinesStackParamList, 'MachineNew'>

export const MachineNew = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const { createMachine, clearMachineData, setMachineData, types, machineData } = store.machines

	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		e.preventDefault()
		navigation.goBack()
	}
	const createMachineSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)
		const createdMachine = await createMachine(machineData)
		if (createdMachine instanceof Error) {
			console.log(createdMachine)
			setCreateError(createdMachine.message)
			setLoading(false)
			return createdMachine
		}
		clearMachineData()
		setCreateError('')
		setLoading(false)
		return linkTo(`/machines/${createdMachine.id}`)
	}
	if (loading) return <Text>Loading...</Text>
	return (
		<>
			<MachineForm
				machineData={machineData}
				setMachineData={setMachineData}
				types={types}
				error={updateError}
				loading={loading}
			/>
			<FAB
				visible={!loading}
				onPress={createMachineSubmit}
				placement='left'
				icon={{ name: 'check', color: 'white' }}
				color='green'
			/>
			<FAB
				visible={!loading}
				onPress={cancelHandler}
				placement='right'
				icon={{ name: 'cancel', color: 'white' }}
				color='red'
			/>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	dropdown: {
		margin: 16,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
})
