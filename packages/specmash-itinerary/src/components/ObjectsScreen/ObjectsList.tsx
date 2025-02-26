import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Avatar } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
// import { DrawerScreenProps } from '@react-navigation/drawer'
import { ObjectStackParamList } from '../../../App'
import { StackScreenProps } from '@react-navigation/stack'
import { Link, useLinkTo } from '@react-navigation/native'
import * as Device from 'expo-device'
import { ObjectCard } from './ObjectCard'

type Props = StackScreenProps<ObjectStackParamList, 'ObjectsList'>

export const ObjectsList = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const { list, objectData, setObjectData, createObject, clearObjectData, getObjects } =
		store.objects
	useEffect(() => {
		getObjects()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const addObjectHandler = async () => {
		setVisibleAddButton(false)
	}
	const addObjectSubmit = async () => {
		setLoading(true)
		const newObject = await createObject(objectData)
		if (newObject instanceof Error) {
			console.log(newObject)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearObjectData()
		getObjects()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		// setObjectData({ isActive: !isActive })
	}
	const device = Device.DeviceType[Device.deviceType || 0]
	return (
		<>
			<ScrollView>
				<View style={styles.table}>
					{list.map((object) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/workplaces/objects/${object.id}`
										: { screen: 'ObjectDetails', params: { id: object.id } }
								}
								key={object.id}
								style={[styles.link]}
							>
								<ListItem bottomDivider style={styles.row} containerStyle={styles.row}>
									<Avatar
										rounded
										title={object.name?.charAt(0).toUpperCase()}
										containerStyle={{ backgroundColor: 'grey' }}
									/>
									<ListItem.Content>
										<ListItem.Title>{object.name}</ListItem.Title>
										<ListItem.Subtitle>{object.address}</ListItem.Subtitle>
										<ListItem.Subtitle>{object.contacts}</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							</Link>
						)
					})}
					{!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Наименование'
										value={objectData.name}
										onChangeText={(e) => setObjectData({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Контакты'
										value={objectData.contacts}
										onChangeText={(e) => {
											console.log(e)
											setObjectData({ contacts: e })
										}}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Адрес'
										value={objectData.address}
										onChangeText={(e) => setObjectData({ address: e })}
										disabled={loading}
									/>
								</View>
								{/* <View style={styles.inputsCell}>
									<Input
										placeholder='Комментарий'
										value={objectData.comment}
										onChangeText={(e) => setObjectData({ comment: e })}
										disabled={loading}
									/>
								</View> */}
								<View style={styles.inputsCell}></View>
							</View>
							<View style={styles.inputsSubmitRow}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!objectData.name || loading}
									onPress={addObjectSubmit}
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
				onPress={() => linkTo('/workplaces/objects/new')}
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
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	link: {
		display: 'flex',
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
	row: {
		flex: 1,
		flexDirection: 'row',
		// borderBottomWidth: 1,
		// borderColor: '#ddd',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		borderBottomWidth: 2, // увеличили толщину линии для заголовка
	},
	cell: {
		flex: 1,
		padding: 10,
		textAlign: 'left', // выравнивание по центру
	},
	cellHeader: {
		padding: 10,
		fontWeight: 'bold', // жирный шрифт
		textAlign: 'left',
	},
	inputsCell: {
		flex: 1,
		flexDirection: 'row',
	},
	inputsSubmitRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
})

const cols = [
	{ key: 'name', label: 'ФИО' },
	{ key: 'phone', label: 'Телефон' },
	{ key: 'nickname', label: 'Псевдоним' },
	{ key: 'comment', label: 'Комментарий' },
	{ key: 'role', label: 'Роль' },
	// { key: 'isActive', label: 'Активен' },
]
