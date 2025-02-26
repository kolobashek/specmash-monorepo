import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { Link, useLinkTo } from '@react-navigation/native'
import * as Device from 'expo-device'

export const MachinesList = observer(() => {
	const {
		machines,
		machineData,
		types,
		setMachineData,
		createMachine,
		clearMachineData,
		getMachines,
	} = store.machines
	const linkTo = useLinkTo()
	useEffect(() => {
		getMachines()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const addMachineHandler = async () => {
		setVisibleAddButton(false)
	}
	const addMachineSubmit = async () => {
		setLoading(true)
		const newMachine = await createMachine(machineData)
		if (newMachine instanceof Error) {
			console.log(newMachine)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearMachineData()
		getMachines()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const typesList = [
		...types.map((type) => {
			return {
				key: type.id,
				title: type.name,
				containerStyle: { backgroundColor: 'white' },
				titleStyle: { color: 'black' },
				onPress: async () => {
					setMachineData({ type: type.name })
					setIsVisibleBS(false)
				},
			}
		}),
		{
			title: 'Cancel',
			containerStyle: { backgroundColor: 'red' },
			titleStyle: { color: 'white' },
			onPress: () => {
				setIsVisibleBS(false)
				setVisibleAddButton(true)
			},
		},
	]
	const device = Device.DeviceType[Device.deviceType || 0]
	return (
		<>
			<ScrollView>
				<View>
					{machines.map((machine) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/machines/${machine.id}`
										: { screen: 'MachineDetails', params: { id: machine.id } }
								}
								key={machine.id}
								style={[styles.link]}
							>
								<ListItem key={machine.id} bottomDivider>
									<ListItem.Content>
										<ListItem.Title>{machine.name}</ListItem.Title>
										<ListItem.Subtitle>{machine.type}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.dimensions}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.weight}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.licensePlate}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.nickname}</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							</Link>
						)
					})}
					{!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.cell}>
									<Input
										placeholder='Марка/модель'
										value={machineData.name}
										onChangeText={(e) => setMachineData({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Button
										title={machineData.type || 'Тип'}
										onPress={() => setIsVisibleBS(true)}
										disabled={loading}
									/>
									<BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{typesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Габариты'
										value={machineData.dimensions}
										onChangeText={(e) => setMachineData({ dimensions: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Масса, кг'
										value={machineData.weight.toString()}
										onChangeText={(e) => setMachineData({ weight: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Гос. номер'
										value={machineData.licensePlate}
										onChangeText={(e) => setMachineData({ licensePlate: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Псевдоним'
										value={machineData.nickname}
										onChangeText={(e) => setMachineData({ nickname: e })}
										disabled={loading}
									/>
								</View>
							</View>
							<View style={styles.row}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!machineData.name || !machineData.type || loading}
									onPress={addMachineSubmit}
									loading={loading}
								/>
								<Button
									color={'red'}
									icon={{ name: 'cancel', color: 'white' }}
									onPress={cancelHandler}
									disabled={loading}
								/>
							</View>
						</>
					)}
				</View>
			</ScrollView>
			<FAB
				visible={visibleAddButton}
				onPress={() => linkTo('/machines/new')}
				placement='right'
				icon={{ name: 'add', color: 'white' }}
				color='green'
			/>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 20,
	},
	table: {
		flex: 1,
		paddingHorizontal: 16, // добавили горизонтальный padding
	},
	link: {
		display: 'flex',
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	header: {
		flexDirection: 'row',
		borderBottomWidth: 2, // увеличили толщину линии для заголовка
	},
	cell: {
		flex: 1,
		padding: 10,
		textAlign: 'center', // выравнивание по центру
	},
	cellHeader: {
		flex: 1,
		padding: 10,
		fontWeight: 'bold', // жирный шрифт
		textAlign: 'center',
	},
})

const cols = [
	{ key: 'name', label: 'Марка/модель' },
	{ key: 'type', label: 'Тип' },
	{ key: 'dimensions', label: 'Габариты' },
	{ key: 'weight', label: 'Масса' },
	{ key: 'licensePlate', label: 'ГРЗ' },
	{ key: 'nickname', label: 'Кодовое имя' },
]
