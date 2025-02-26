import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { UsersStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { IUserData } from '../../store/usersStore'

type Props = {
	userData: IUserData
	setUserData: (user: IUserData) => void
	roles: { label: string; value: string }[]
	loading?: boolean
	error?: string
}

export const UserForm = ({ userData, setUserData, roles, loading, error }: Props) => {
	const [name, setUserName] = useState(userData.name)
	const [role, setUserRole] = useState(userData.role)
	const [phone, setUserPhone] = useState(userData.phone)
	const [nickname, setUserNickname] = useState(userData.nickname)
	const [comment, setUserComment] = useState(userData.comment)
	useEffect(() => {
		setUserData({
			...userData,
			name,
			role,
			phone,
			nickname,
			comment,
		})
	}, [name, role, phone, nickname, comment])
	return (
		<Card>
			<Card.Title>
				{`${userData.name}` + (userData.nickname ? `, ${userData.nickname}` : '')}
			</Card.Title>
			<Card.Divider />
			<View>
				<ListItem>
					<ListItem.Title>Наименование:</ListItem.Title>
					<ListItem.Input
						placeholder={userData.name || 'Наименование'}
						value={name}
						onChangeText={setUserName}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Позывной:</ListItem.Title>
					<ListItem.Input
						placeholder={nickname || 'Позывной'}
						value={nickname}
						onChangeText={setUserNickname}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Телефон:</ListItem.Title>
					<ListItem.Input
						placeholder='80000000000'
						value={phone}
						onChangeText={setUserPhone}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Тип: </ListItem.Title>
					<Dropdown
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={roles}
						search
						maxHeight={300}
						labelField='label'
						valueField='value'
						placeholder={role || 'Выберите тип'}
						searchPlaceholder='Search...'
						value={userData.role}
						onChange={(role) => setUserRole(role.label)}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.label}</Text>
									{item.label === userData.role && (
										<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
									)}
								</View>
							)
						}}
						disable={loading}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Гос. номер:</ListItem.Title>
					<ListItem.Input
						placeholder='А 000 АА 000'
						value={comment}
						onChangeText={setUserComment}
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
}

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
