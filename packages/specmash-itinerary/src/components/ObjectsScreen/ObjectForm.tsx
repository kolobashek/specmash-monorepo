import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IObjectData } from '../../store/objectStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ObjectStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { MultiSelect } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { IObject } from '../../store/objectStore'
import { IContrAgent } from '../../store/contrAgentStore'

type Props = {
	objectId?: number
	// setObjectData: (object: IObjectData) => void
	// contrAgentVariants: IContrAgent[]
	loading?: boolean
	error?: string
}

export const ObjectForm = observer(({ objectId, loading, error }: Props) => {
	const { setObjectData, objectData, getObjectById } = store.objects
	const { getContrAgents } = store.contrAgents
	// const [name, setObjectName] = useState(objectData.name)
	// const [contacts, setObjectContacts] = useState(objectData.contacts)
	// const [address, setObjectAddress] = useState(objectData.address)
	// // const [comment, setObjectComment] = useState(objectData.comment)
	// const [contrAgents, setObjectContragents] = useState(objectData.contrAgents || [])
	const { name, contacts, address, contrAgents } = objectData
	const [allContrAgents, setAllContrAgents] = useState([] as IContrAgent[])
	const inputChange = (input: Partial<IObjectData>) => {
		setObjectData({
			...objectData,
			...input,
		})
	}
	useEffect(() => {
		const start = async () => {
			const cAFromApi = await getContrAgents()
			if (cAFromApi instanceof Error) {
				return
			}
			setAllContrAgents(cAFromApi)
			if (objectId) {
				const initialData = await getObjectById(objectId)
				setObjectData(initialData)
			}
		}
	}, [])
	return (
		<Card>
			<Card.Title>
				{`${objectData.name}` +
					(objectData.contrAgents?.length
						? ` //${objectData.contrAgents.map((ca) => ca.name).join(', ')}`
						: '')}
			</Card.Title>
			<Card.Divider />
			<View>
				<ListItem>
					<ListItem.Title>Наименование:</ListItem.Title>
					<ListItem.Input
						placeholder={objectData.name || 'Наименование'}
						value={name}
						onChangeText={(e) => inputChange({ name: e })}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Адрес:</ListItem.Title>
					<ListItem.Input
						placeholder='Введите адрес'
						value={address}
						onChangeText={(e) => {
							inputChange({ address: e })
						}}
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
					<ListItem.Title>Контрагенты:</ListItem.Title>
					<MultiSelect
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={allContrAgents}
						search
						searchField='name'
						maxHeight={300}
						labelField={'name'}
						valueField={'id'}
						placeholder={contrAgents.map((obj) => obj.name).join(', ') || 'Выберите контрагентов'}
						searchPlaceholder='Найти...'
						value={contrAgents.map((obj) => obj.name)}
						onChange={(value: string[]) => {
							const selectedCAs = allContrAgents.filter((ca) => value.includes(String(ca.id)))
							if (selectedCAs.length > 0) {
								inputChange({ contrAgents: selectedCAs })
							} else {
								inputChange({ contrAgents: [] })
							}
						}}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.name}</Text>
									{item.id === objectData.contrAgents?.find((obj) => obj.id === item.id)?.id && (
										<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
									)}
								</View>
							)
						}}
						disable={loading}
					/>
				</ListItem>
				{/* <ListItem>
					<ListItem.Title>Комментарий:</ListItem.Title>
					<ListItem.Input
						placeholder={comment || 'Комментарий'}
						value={comment}
						onChangeText={setObjectComment}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem> */}
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
