import React from 'react'
import { Outlet, RouteObject, redirect, useLocation } from 'react-router-dom'
import {
	AppLayout,
	MachineCard,
	MachineEdit,
	MachineNew,
	MachinesList,
	PartnerCard,
	PartnerEdit,
	PartnerNew,
	PartnersList,
	PublicPage,
	ScreenInfo,
	ScreenLogin,
	ScreenRegister,
	ScreenSchedule,
	ScreenShift,
	UserCard,
	UserEdit,
	UserNew,
	UsersList,
	WorkPlaceCard,
	WorkPlaceEdit,
	WorkPlaceNew,
	WorkPlacesList,
} from '../components'
import store from '../store'
import ErrorPage from '../errorPage'
import { loginLoader, protectedLoader } from '../utils'

export const LocationDisplay = () => {
	const location = useLocation()
	if (location) {
		return <div data-testid='location-display'>{location.pathname}</div>
	}
	return <></>
}

export const routesConfig: RouteObject[] = [
	{
		id: 'root',
		path: '/',
		loader() {
			// Our root route always provides the user, if logged in
			return { user: store.auth.isAuthenticated }
		},
		element: <AppLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <PublicPage />,
			},
			{
				path: 'login',
				loader: loginLoader,
				element: <ScreenLogin />,
			},
			{
				path: 'register',
				loader: loginLoader,
				element: <ScreenRegister />,
			},
			{
				path: 'users',
				loader: protectedLoader,
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <UsersList />,
					},
					{
						path: ':id',
						loader: protectedLoader,
						element: <UserCard />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <UserEdit />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <UserNew />,
					},
				],
			},
			{
				path: 'workPlaces',
				loader: protectedLoader,
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <WorkPlacesList />,
					},
					{
						path: ':id',
						loader: protectedLoader,
						element: <WorkPlaceCard />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <WorkPlaceEdit />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <WorkPlaceNew />,
					},
				],
			},
			{
				path: 'contragents',
				loader: protectedLoader,
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PartnersList />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <PartnerNew />,
					},
					{
						path: ':id',
						loader: protectedLoader,
						element: <PartnerCard />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <PartnerEdit />,
					},
				],
			},
			{
				path: 'machines',
				loader: protectedLoader,
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <MachinesList />,
					},
					{
						path: ':id',
						loader: protectedLoader,
						element: <MachineCard />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <MachineEdit />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <MachineNew />,
					},
				],
			},
			{
				path: 'shifts',
				loader: protectedLoader,
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <ScreenShift />,
					},
					{
						path: ':id',
						loader: protectedLoader,
						element: <ScreenShift />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <ScreenShift />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <ScreenShift />,
					},
				],
			},
			{
				path: 'schedule',
				loader: protectedLoader,
				element: <ScreenSchedule />,
				children: [
					{
						path: ':id',
						loader: protectedLoader,
						element: <ScreenSchedule />,
					},
					{
						path: ':id/edit',
						loader: protectedLoader,
						element: <ScreenSchedule />,
					},
					{
						path: 'new',
						loader: protectedLoader,
						element: <ScreenSchedule />,
					},
				],
			},
			{
				path: 'info',
				loader: protectedLoader,
				element: <ScreenInfo />,
			},
		],
	},
	{
		path: '/logout',
		action() {
			// We signout in a "resource route" that we can hit from a fetcher.Form
			store.auth.signOut()
			return redirect('/')
		},
	},
]
