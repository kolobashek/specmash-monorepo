import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IUser } from '../../store/usersStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { UsersStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { UserForm } from './UserForm'

type Props = StackScreenProps<UsersStackParamList, 'UserNew'>

export const UserNew = observer(({ navigation }: Props) => {
	const rolesFormatter = (roles: string[]) =>
		roles.map((role) => ({ label: roleName(role), value: role }))
	const linkTo = useLinkTo()
	const { createUser, clearUserData, setUserData, roles, getRoles, userData, roleName } =
		store.users
	const [formattedRoles, setFormattedRoles] = useState(rolesFormatter(roles))
	useEffect(() => {
		const Roles = async () => {
			const rolesFromApi = await getRoles()
			if (rolesFromApi instanceof Error) {
				return rolesFromApi
			}
			setFormattedRoles(rolesFormatter(rolesFromApi))
		}
		Roles()
	}, [])

	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		e.preventDefault()
		navigation.goBack()
	}
	const createUserSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)
		const createdUser = await createUser(userData)
		if (createdUser instanceof Error) {
			console.log(createdUser)
			setCreateError(createdUser.message)
			setLoading(false)
			return createdUser
		}
		clearUserData()
		setCreateError('')
		setLoading(false)
		return linkTo(`/users/${createdUser.id}`)
	}
	if (loading) return <Text>Loading...</Text>
	return (
		<>
			<UserForm
				userData={userData}
				setUserData={setUserData}
				roles={formattedRoles}
				error={updateError}
				loading={loading}
			/>
			<FAB
				visible={!loading}
				onPress={createUserSubmit}
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
