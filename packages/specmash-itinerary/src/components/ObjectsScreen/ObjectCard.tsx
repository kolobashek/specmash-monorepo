import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IObject } from '../../store/objectStore'
import { StackScreenProps } from '@react-navigation/stack'
import { ObjectStackParamList } from '../../../App'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { useLinkTo } from '@react-navigation/native'
import * as Device from 'expo-device'

type Props = StackScreenProps<ObjectStackParamList, 'ObjectDetails'>

export const ObjectCard = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const device = Device.DeviceType[Device.deviceType || 0]
	const {
		currentObject,
		setCurrentObject,
		getObjectById,
		getObjects,
		updateObject,
		clearObjectData,
		setObjectData,
		objectData,
	} = store.objects
	const objectId = Number(
		navigation.getState().routes.find((r) => r.name === 'ObjectDetails')?.params?.id
	)
	const link =
		device === 'DESKTOP'
			? `/workplaces/objects/${objectId}`
			: { screen: 'ObjectDetails', params: { id: objectId } }
	useEffect(() => {
		const user = async () => {
			const input = await getObjectById(objectId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setObjectData(input)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editObjectHandler = () => {
		linkTo(`/workplaces/objects/${objectId}/edit`)
	}
	const editObjectSubmit = async (id: number) => {
		setLoading(true)
		const newObject = await updateObject({ id, ...objectData })
		if (newObject instanceof Error) {
			console.log(newObject)
			setUpdateError(newObject.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentObject(newObject)
		setVisibleEditButton(true)
		setLoading(false)
		clearObjectData()
		return newObject
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setObjectInput({ isActive: !isActive })
	// }
	if (!currentObject) return <Text>Что-то пошло не так.</Text>
	if (!visibleEditButton)
		return (
			<>
				<Card>
					<Card.Title>{currentObject.name}</Card.Title>
					<Card.Divider />
					<View>
						<ListItem>
							<ListItem.Title>Контакты:</ListItem.Title>
							<ListItem.Input
								placeholder='Контакты'
								value={objectData.contacts}
								onChangeText={(text) => setObjectData({ contacts: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
						<ListItem>
							{/* <ListItem.Title>Роль: </ListItem.Title>
							<Dropdown
								style={styles.dropdown}
								placeholderStyle={styles.placeholderStyle}
								selectedTextStyle={styles.selectedTextStyle}
								inputSearchStyle={styles.inputSearchStyle}
								iconStyle={styles.iconStyle}
								data={roles.map((role) => {
									return { label: roleName(role), value: role }
								})}
								search
								maxHeight={300}
								labelField='label'
								valueField='value'
								placeholder='Select item'
								searchPlaceholder='Search...'
								value={objectInput.role}
								onChange={(role) => setObjectInput({ role: role.value })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<View style={styles.item}>
											<Text style={styles.textItem}>{item.label}</Text>
											{item.value === objectInput.role && (
												<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
											)}
										</View>
									)
								}}
								disable={loading}
							/> */}
							<ListItem.Title>Адрес:</ListItem.Title>
							<ListItem.Input
								placeholder='Адрес'
								value={objectData.address}
								onChangeText={(text) => setObjectData({ address: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
						{/* <ListItem>
							<ListItem.Title>Комментарий:</ListItem.Title>
							<ListItem.Input
								placeholder='Комментарии'
								value={objectInput.comment}
								onChangeText={(text) => setObjectInput({ comment: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem> */}
					</View>
					{updateError && (
						<>
							<Card.Divider />
							<Text style={{ color: 'red' }}>{updateError}</Text>
						</>
					)}
				</Card>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={() => editObjectSubmit(objectId)}
					placement='left'
					icon={{ name: 'check', color: 'white' }}
					color='green'
				/>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={editObjectHandler}
					placement='right'
					icon={{ name: 'cancel', color: 'white' }}
					color='red'
				/>
			</>
		)
	return (
		<>
			<Card>
				<Card.Title>{currentObject.name}</Card.Title>
				<Card.Divider />
				<View>
					<ListItem>
						<ListItem.Title>Контакты:</ListItem.Title>
						<ListItem.Subtitle>{currentObject.contacts}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Адрес: </ListItem.Title>
						<ListItem.Subtitle>{currentObject.address}</ListItem.Subtitle>
					</ListItem>
					{/* <ListItem>
						<ListItem.Title>Комментарий:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentObject.comment ? currentObject.comment : ''
						}`}</ListItem.Subtitle>
					</ListItem> */}
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editObjectHandler}
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
