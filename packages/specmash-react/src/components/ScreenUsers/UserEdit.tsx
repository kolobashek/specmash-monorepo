import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IUser } from '../../store/usersStore'
import { UserForm } from './UserForm'
import { useNavigate, useParams } from 'react-router-dom'
import { FloatButton } from 'antd'

export const UserEdit = observer(() => {
	const { id } = useParams()
	const userId = Number(id)
	const rolesFormatter = (roles: string[]) =>
		roles.map((role) => ({ label: roleName(role), value: role }))
	const linkTo = useNavigate()
	const { updateUser, setCurrentUser, setUserData, roles, getRoles, userData, roleName } =
		store.users
	const [formattedRoles, setFormattedRoles] = useState(roles)
	useEffect(() => {
		const Roles = async () => {
			const rolesFromApi = await getRoles()
			if (rolesFromApi instanceof Error) {
				return rolesFromApi
			}
			setFormattedRoles(rolesFromApi)
		}
		Roles()
	}, [])
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const updateUserSubmit = async () => {
		const { phone, name, roles } = userData
		if (phone && name && roles) {
			setLoading(true)
			const updatedUser = await updateUser({ ...userData, phone, name, roles, id: userId })
			if (updatedUser instanceof Error) {
				console.log(updatedUser)
				setCreateError(updatedUser.message)
				setLoading(false)
				return updatedUser
			}
			setCreateError('')
			setCurrentUser(updatedUser)
			setLoading(false)
			return linkTo(`/users/${updatedUser.id}`)
		}
		setCreateError('Заполните все необходимые поля')
	}
	if (loading) return <p>Loading...</p>
	return <UserForm />
})

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'stretch',
// 	},
// 	dropdown: {
// 		margin: 16,
// 		height: 50,
// 		backgroundColor: 'white',
// 		borderRadius: 12,
// 		padding: 12,
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.2,
// 		shadowRadius: 1.41,

// 		elevation: 2,
// 	},
// 	icon: {
// 		marginRight: 5,
// 	},
// 	item: {
// 		padding: 17,
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 	},
// 	textItem: {
// 		flex: 1,
// 		fontSize: 16,
// 	},
// 	placeholderStyle: {
// 		fontSize: 16,
// 	},
// 	selectedTextStyle: {
// 		fontSize: 16,
// 	},
// 	iconStyle: {
// 		width: 20,
// 		height: 20,
// 	},
// 	inputSearchStyle: {
// 		height: 40,
// 		fontSize: 16,
// 	},
// })
