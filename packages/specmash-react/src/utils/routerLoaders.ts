import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import authStore from '../store/authStore'

export async function loginLoader({ request }: LoaderFunctionArgs) {
	if (authStore.isAuthenticated) {
		const params = new URLSearchParams()
		params.set('from', new URL(request.url).pathname)
		return redirect('/login?' + params.toString())
	}
	return null
}
export async function protectedLoader({ request }: LoaderFunctionArgs) {
	// If the user is not logged in and tries to access `/protected`, we redirect
	// them to `/login` with a `from` parameter that allows login to redirect back
	// to this page upon successful authentication
	const authStatus = await authStore.getUserByAsyncStorage()
	if (authStatus instanceof Error) {
		const params = new URLSearchParams()
		params.set('from', new URL(request.url).pathname)
		return redirect('/login?' + params.toString())
	}
	// const result = _.some(authStatus.roles, (item) => {
	// 	return _.includes(context.roles as string[], item.name)
	// })
	if (authStatus) {
		return null
	}
	return redirect('/public')
}
