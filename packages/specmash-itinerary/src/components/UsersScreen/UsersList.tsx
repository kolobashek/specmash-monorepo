import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Avatar } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
// import { DrawerScreenProps } from '@react-navigation/drawer'
import { UsersStackParamList } from '../../../App'
import { UserCard } from './UserCard'
import { StackScreenProps } from '@react-navigation/stack'
import * as Device from 'expo-device'
import { Link, useLinkTo } from '@react-navigation/native'

type Props = StackScreenProps<UsersStackParamList, 'UsersList'>

export const UsersList = observer(({ navigation }: Props) => {
	const { list, userData, roles, setUserData, createUser, clearUserData, getUsers } = store.users
	const linkTo = useLinkTo()
	useEffect(() => {
		getUsers()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const addUserHandler = async () => {
		linkTo('/users/new')
	}
	// const addUserSubmit = async () => {
	// 		setLoading(true)
	// 		const newUser = await createUser()
	// 		if (newUser instanceof Error) {
	// 			console.log(newUser)
	// 			setLoading(false)
	// 		}
	// 		setVisibleAddButton(true)
	// 		setLoading(false)
	// 		clearUserInput()
	// 		getUsers()
	// }
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		setUserData({ isActive: !isActive })
	}
	const memoizedRoleName = React.useMemo(() => {
		return (role: string | undefined) => {
			if (role === 'admin') return 'Администратор'
			if (role === 'manager') return 'Менеджер'
			return 'Водитель'
		}
	}, [])
	// const currentUser = navigation.getState().routes.find((r) => r.name === 'UsersList')
	// 	?.params?.id
	const rolesList = [
		...roles.map((role, key) => {
			return {
				key,
				title: memoizedRoleName(role),
				containerStyle: { backgroundColor: 'white' },
				titleStyle: { color: 'black' },
				onPress: async () => {
					setUserData({ role })
					setIsVisibleBS(false)
				},
			}
		}),
		{
			title: 'Отмена',
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
			<ScrollView stickyHeaderHiddenOnScroll stickyHeaderIndices={[0]}>
				{/* <StickyHeader titles={cols} /> */}
				<View style={styles.table}>
					{list.map((user) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/users/${user.id}`
										: { screen: 'UserDetails', params: { id: user.id } }
								}
								key={user.id}
								style={[styles.link]}
							>
								<ListItem bottomDivider style={styles.row} containerStyle={styles.row}>
									<Avatar
										rounded
										title={user.name?.charAt(0).toUpperCase()}
										containerStyle={{ backgroundColor: 'grey' }}
									/>
									<ListItem.Content>
										<ListItem.Title>{user.name}</ListItem.Title>
										<ListItem.Subtitle>{memoizedRoleName(user.role)}</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							</Link>
						)
					})}
					{/* {!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.inputsCell}>
									<Input
										placeholder='ФИО'
										value={userData.name}
										onChangeText={(e) => setUserData({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Телефон'
										value={userData.phone}
										onChangeText={(e) => {
											console.log(e)
											setUserData({ phone: e })
										}}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Псевдоним'
										value={userData.nickname}
										onChangeText={(e) => setUserData({ nickname: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Комментарий'
										value={userData.comment}
										onChangeText={(e) => setUserData({ comment: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Button
										title={userData.role || 'Роль'}
										onPress={() => setIsVisibleBS(true)}
										disabled={loading}
									/>
									<Button
										color={isActive ? 'gray' : 'warning'}
										icon={
											isActive
												? { name: 'check', color: 'white' }
												: { name: 'cancel', color: 'white' }
										}
										onPress={isActiveHandler}
										disabled={loading}
									/>
									<BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{rolesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet>
								</View>
							</View>
							<View style={styles.inputsSubmitRow}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!userData.name || !userData.role || loading}
									onPress={addUserSubmit}
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
					)} */}
				</View>
			</ScrollView>
			<FAB
				visible={visibleAddButton}
				onPress={addUserHandler}
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
