import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
// import { DrawerScreenProps } from '@react-navigation/drawer'
import { Avatar, Breadcrumb, FloatButton, List } from 'antd'
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, Link, Outlet } from 'react-router-dom'
import { localizedRoleName } from '../../utils'

export const UsersList = observer(() => {
	document.title = 'Список пользователей'
	const { users, uiStore } = store
	const { setHeaderContent } = uiStore
	const { list, getUsers, usersFilter } = users
	const navigate = useNavigate()
	useEffect(() => {
		getUsers()
		setHeaderContent('userSearch')
		return () => {
			setHeaderContent('default')
		}
	}, [])
	useEffect(() => {
		if (usersFilter) {
			console.log(usersFilter.search)
			getUsers()
		}
	}, [usersFilter.search])

	const addUserHandler = async () => {
		navigate('/users/new')
	}
	return (
		<>
			<Breadcrumb
				separator='>'
				items={[
					{
						title: 'Главная',
						href: '/',
					},
					{
						title: 'Пользователи',
					},
				]}
			/>
			<List
				itemLayout='horizontal'
				dataSource={list}
				style={{
					maxWidth: 600,
					margin: '0 auto',
				}}
				renderItem={(user) => {
					return (
						<List.Item
							actions={[
								<Link key='1' to={`/users/${user.id}`}>
									Подробнее
								</Link>,
								<Link key='2' to={`/users/${user.id}/edit`}>
									Изменить
								</Link>,
							]}
						>
							<List.Item.Meta
								avatar={
									<Avatar
										size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
										icon={<UserOutlined />}
									>
										{user.name[0]}
									</Avatar>
								}
								title={
									<Link to={`/users/${user.id}`} key={user.id}>
										{user.name}
									</Link>
								}
								description={`Роли: ${user.roles
									.map((role) => ' ' + localizedRoleName(role.name))
									.toString()}`}
							/>
						</List.Item>
					)
				}}
			/>
			<Outlet />
			<FloatButton
				onClick={addUserHandler}
				icon={<PlusCircleOutlined />}
				tooltip='Добавить пользователя'
			/>
		</>
	)
})
