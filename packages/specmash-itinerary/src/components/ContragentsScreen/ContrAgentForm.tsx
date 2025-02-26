import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IContrAgentData } from '../../store/contrAgentStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { MultiSelect } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { IObject } from '../../store/objectStore'

type Props = {
	contrAgentId?: number
	loading: boolean
	error: string
}

export const ContrAgentForm = observer(({ contrAgentId, loading, error }: Props) => {
	const {
		createContrAgent,
		clearContrAgentData,
		setContrAgentData,
		contrAgentData,
		getContrAgentById,
		// setCurrentContrAgent,
		updateContrAgent,
	} = store.contrAgents
	const { getObjects } = store.objects
	const [allObjects, setAllObjects] = useState([] as IObject[])
	const { name, contacts, address, comments, objects } = contrAgentData
	const inputChange = (input: Partial<IContrAgentData>) => {
		setContrAgentData({
			...contrAgentData,
			...input,
		})
	}
	useEffect(() => {
		const start = async () => {
			const objectsFromApi = await getObjects()
			if (objectsFromApi instanceof Error) {
				return
			}
			setAllObjects(objectsFromApi)
			if (contrAgentId) {
				const initialData = await getContrAgentById(contrAgentId)
				setContrAgentData(initialData)
			}
		}
		start()
	}, [])
	console.log(contrAgentData)
	return (
		<Card>
			<Card.Title>
				{`${contrAgentData.name}` +
					(contrAgentData.objects?.length
						? ` //${contrAgentData.objects.map((obj) => obj.name).join(', ')}`
						: '')}
			</Card.Title>
			<Card.Divider />
			<View>
				<ListItem>
					<ListItem.Title>Наименование:</ListItem.Title>
					<ListItem.Input
						placeholder={contrAgentData.name || 'Наименование'}
						value={name}
						onChangeText={(e) => inputChange({ name: e })}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Адрес:</ListItem.Title>
					<ListItem.Input
						placeholder='Введите адрес - физический или юридический'
						value={address}
						onChangeText={(e) => inputChange({ address: e })}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Контакты:</ListItem.Title>
					<ListItem.Input
						placeholder='телефон, email, ФИО, должность'
						value={contacts}
						onChangeText={(e) => {
							inputChange({ contacts: e })
						}}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Тип: </ListItem.Title>
					<MultiSelect
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={allObjects}
						search
						searchField='name'
						maxHeight={300}
						labelField={'name'}
						valueField={'id'}
						placeholder={objects.map((obj) => obj.name).join(', ') || 'Выберите объекты'}
						searchPlaceholder='Найти...'
						value={objects?.map((obj) => obj.name || '')}
						onChange={(value: string[]) => {
							const selectedObjects = allObjects.filter((ca) => value.includes(String(ca.id)))
							if (selectedObjects.length > 0) {
								inputChange({ objects: selectedObjects })
							} else {
								inputChange({ objects: [] })
							}
						}}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.name}</Text>
									{item.id === contrAgentData.objects?.find((obj) => obj.id === item.id)?.id && (
										<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
									)}
								</View>
							)
						}}
						disable={loading}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Комментарий:</ListItem.Title>
					<ListItem.Input
						placeholder={comments || 'Комментарий'}
						value={comments}
						onChangeText={(e) => {
							inputChange({ comments: e })
						}}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
			</View>
			{error && (
				<>
					<Card.Divider />
					<Text style={{ color: 'red' }}>{error}</Text>
				</>
			)}
		</Card>
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
