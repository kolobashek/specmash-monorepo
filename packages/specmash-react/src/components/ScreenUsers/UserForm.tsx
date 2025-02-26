import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from '../../utils'
import { IRole, IUserData } from '../../store/usersStore'
import { Button, Divider, Form, Input, Select, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

export const UserForm = observer(() => {
	const { id } = useParams()
	const userId = Number(id)
	const linkTo = useNavigate()
	const { createUser, clearUserData, setUserData, getRoles, userData, updateUser, getUserById } =
		store.users
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')
	const [allRoles, setAllRoles] = useState([] as IRole[])
	useEffect(() => {
		const start = async () => {
			try {
				const rolesFromApi = await getRoles()
				if (rolesFromApi instanceof Error) {
					return
				}
				setAllRoles(rolesFromApi)
				if (userId) {
					const initialData = await getUserById(userId)
					setUserData(initialData)
				}
			} catch (error) {
				console.error(error)
			}
		}
		start()
	}, [])
	const { name, phone, nickname, roles, comment } = userData
	const inputChange = (input: Partial<IUserData>) => {
		setUserData({
			...userData,
			...input,
		})
	}
	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}
	const changeRolesHandler = (value: number[]) => {
		console.log(value)
		const roles = value.map((_) => {
			return allRoles.filter((role) => role.id === _)[0]
		})
		setUserData({ roles })
	}
	const submitHandler = async () => {
		const { phone, name, roles } = userData
		if (phone && name && roles) {
			setLoading(true)
			let response
			if (userId) {
				response = await updateUser({ ...userData, phone, name, roles, id: userId })
			} else {
				response = await createUser({ ...userData, phone, name, roles })
			}
			if (response instanceof Error) {
				// console.log(response)
				setCreateError(response.message)
				setLoading(false)
				return response
			}
			clearUserData()
			setCreateError('')
			setLoading(false)
			return linkTo(`/users/${response.id}`)
		}
		setCreateError('Заполните обязательные поля')
	}
	return (
		<Form
			name='partner'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			onFinish={submitHandler}
			onFinishFailed={onFinishFailed}
			autoComplete='off'
			onFocus={() => {
				setCreateError('')
			}}
		>
			<h1>Пользователь</h1>
			<Form.Item>{userData.name}</Form.Item>
			<Divider />
			<div>
				<Form.Item label='ФИО:'>
					<Input
						placeholder={userData.name || 'ФИО'}
						value={name}
						onChange={(e) => inputChange({ name: e.target.value })}
						disabled={loading}
						required
					/>
				</Form.Item>
				<Form.Item label='Телефон:'>
					<Input
						placeholder='Введите номер телефона'
						value={phone}
						onChange={(e) => inputChange({ phone: e.target.value })}
						disabled={loading}
						style={{ textAlign: 'left' }}
						required
					/>
				</Form.Item>
				<Form.Item label='Позывной:'>
					<Input
						placeholder='Кличка'
						value={nickname}
						onChange={(e) => {
							inputChange({ nickname: e.target.value })
						}}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</Form.Item>
				<Form.Item label='Роли:'>
					<Select
						mode='multiple'
						placeholder='Выберите роли'
						value={roles?.map((role) => role.id)}
						onChange={changeRolesHandler}
						style={{ width: '100%' }}
						options={allRoles.map((role) => {
							return { value: role.id, label: localizedRoleName(role.name) || '' }
						})}
						allowClear
						aria-required
						// fieldNames={{
						// 	label: 'name',
						// 	value: 'id',
						// }}
					/>
				</Form.Item>
				<Form.Item label='Комментарий:'>
					<Input
						placeholder={comment || 'Комментарий'}
						value={comment}
						onChange={(e) => {
							inputChange({ comment: e.target.value })
						}}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</Form.Item>
			</div>
			{updateError && (
				<>
					<Divider />
					<p style={{ color: 'red' }}>{updateError}</p>
				</>
			)}
			<Form.Item>
				<Space>
					<Button
						type='primary'
						htmlType='submit'
						className='login-form-button'
						disabled={!userData.name?.length || !userData.phone?.length || !userData.roles?.length}
					>
						Записать
					</Button>
					<Button type='primary' htmlType='reset' className='login-form-button' danger>
						Отмена
					</Button>
				</Space>
			</Form.Item>
		</Form>
	)
})
