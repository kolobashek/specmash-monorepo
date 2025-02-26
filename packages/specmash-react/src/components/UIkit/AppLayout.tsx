import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import store from '../../store'
import { HeaderContent } from './Header'
import { AppDrawer } from './Drawer'
import { LocationDisplay } from '../../services/routes'

const { Header, Footer, Content } = Layout

export const AppLayout = observer(({ children }: { children?: React.ReactNode }) => {
	// export const AppLayout = observer(() => {
	useEffect(() => {
		const checkAuth = async () => {
			await store.auth.getUserByAsyncStorage()
		}
		checkAuth()
	}, [])
	return (
		<Layout>
			<Header style={headerStyle}>
				<HeaderContent />
			</Header>
			<Layout>
				<Content style={contentStyle}>
					{children}
					<Outlet />
				</Content>
			</Layout>
			<Footer style={footerStyle}>Footer</Footer>
			<AppDrawer />
			<LocationDisplay />
		</Layout>
	)
})

const headerStyle: React.CSSProperties = {
	// textAlign: 'center',
	color: '#fff',
	height: 64,
	paddingInline: 10,
	lineHeight: '64px',
	backgroundColor: '#7dbcea',
}

const contentStyle: React.CSSProperties = {
	textAlign: 'center',
	minHeight: window.innerHeight - 64 - 66,
	lineHeight: '120px',
	// color: '#fff',
	// backgroundColor: '#108ee9',
}

const footerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#fff',
	backgroundColor: '#7dbcea',
}
