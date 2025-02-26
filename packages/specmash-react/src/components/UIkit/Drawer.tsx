import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Drawer, Button, Space, Row, Col } from 'antd'
import store from '../../store'
import { Link, useFetcher } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'

export const AppDrawer = observer(() => {
	const { isAuthenticated, currentUser, hasRoles } = store.auth
	const { drawerOpened, hideDrawer } = store.uiStore

	const AuthStatus = () => {
		// Get our logged in user, if they exist, from the root route loader data
		// const { user } = useRouteLoaderData('root') as { user: string | null }
		const fetcher = useFetcher()
		if (!isAuthenticated) {
			return (
				<Link to='/login'>
					<Button type='primary' onClick={hideDrawer}>
						Войти
					</Button>
				</Link>
			)
		}
		const isLoggingOut = fetcher.formData != null

		return (
			<div>
				<p>Welcome {currentUser.name}!</p>
				<fetcher.Form method='post' action='/logout'>
					<Button type='primary' htmlType='submit' disabled={isLoggingOut}>
						{isLoggingOut ? 'Signing out...' : 'Sign out'}
					</Button>
				</fetcher.Form>
			</div>
		)
	}
	return (
		<Drawer
			title='СПЕЦМАШ'
			placement={'left'}
			width={500}
			onClose={hideDrawer}
			open={drawerOpened}
			extra={
				<Space>
					<Button onClick={hideDrawer}>Cancel</Button>
					<Button type='primary' onClick={hideDrawer}>
						OK
					</Button>
				</Space>
			}
			footer={<AuthStatus />}
		>
			{/* <p>Some contents...</p> */}
			<p>
				<Link to='/' onClick={hideDrawer}>
					На главную
				</Link>
			</p>
			{hasRoles('admin', 'manager') && (
				<>
					<p>
						<Link to='/users' onClick={hideDrawer}>
							Пользователи
						</Link>
					</p>
					<p>
						<Link to='/machines' onClick={hideDrawer}>
							Машины
						</Link>
					</p>
					<p>
						<Link to='/contragents' onClick={hideDrawer}>
							Контрагенты
						</Link>
					</p>
					<p>
						<Link to='/workPlaces' onClick={hideDrawer}>
							Объекты
						</Link>
					</p>
				</>
			)}
			{hasRoles('admin', 'manager', 'driver') && (
				<>
					<p>
						<Link to='/shifts' onClick={hideDrawer}>
							Смены
						</Link>
					</p>
					<p>
						<Link to='/schedule' onClick={hideDrawer}>
							Расписание
						</Link>
					</p>
					<p>
						<Link to='/info' onClick={hideDrawer}>
							Информация
						</Link>
					</p>
				</>
			)}
		</Drawer>
	)
})
