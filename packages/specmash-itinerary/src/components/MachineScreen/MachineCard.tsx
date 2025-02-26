import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IMachine } from '../../store/machinesStore'
import { StackScreenProps } from '@react-navigation/stack'
import { MachinesStackParamList } from '../../../App'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { MachineForm } from './MachineForm'
import { useLinkTo } from '@react-navigation/native'

type Props = StackScreenProps<MachinesStackParamList, 'MachineDetails'>

export const MachineCard = observer(({ navigation }: Props) => {
	const {
		currentMachine,
		setCurrentMachine,
		getMachineById,
		getMachines,
		updateMachine,
		clearMachineData,
		setMachineData,
		types,
		machineData,
	} = store.machines
	const linkTo = useLinkTo()
	const machineId = Number(
		navigation.getState().routes.find((r) => r.name === 'MachineDetails')?.params?.id
	)
	useEffect(() => {
		const machine = async () => {
			setLoading(true)
			const input = await getMachineById(machineId)
			if (input instanceof Error) {
				setLoading(false)
				return new Error('Unable to fetch machine')
			}
			setMachineData(input)
			setCurrentMachine(input)
			setLoading(false)
		}
		machine()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editMachineHandler = () => {
		linkTo(`/machines/${machineId}/edit`)
		// setVisibleEditButton(!visibleEditButton)
	}
	const editMachineSubmit = async (id: number) => {
		setLoading(true)
		const updatedMachine = await updateMachine({ id, ...machineData })
		if (updatedMachine instanceof Error) {
			console.log(updatedMachine)
			setUpdateError(updatedMachine.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentMachine(updatedMachine)
		setVisibleEditButton(true)
		setLoading(false)
		// clearMachineData()
		return updatedMachine
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setMachineData({ isActive: !isActive })
	// }
	if (loading) return <Text>Loading...</Text>
	if (!currentMachine) return <Text>Что-то пошло не так.</Text>
	// if (!visibleEditButton) return <MachineForm id={currentMachine.id} />
	return (
		<>
			<Card>
				<Card.Title>
					{`${currentMachine.name}` +
						(currentMachine.nickname ? `, ${currentMachine.nickname}` : '')}
				</Card.Title>
				<Card.Divider />
				<View>
					<ListItem>
						<ListItem.Title>Вес, кг:</ListItem.Title>
						<ListItem.Subtitle>{`${currentMachine.weight}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Тип: </ListItem.Title>
						<ListItem.Subtitle>{`${currentMachine.type}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Гос. номер:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentMachine.licensePlate ? currentMachine.licensePlate : ''
						}`}</ListItem.Subtitle>
					</ListItem>
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editMachineHandler}
				placement='right'
				icon={{ name: 'edit', color: 'white' }}
				color='green'
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
