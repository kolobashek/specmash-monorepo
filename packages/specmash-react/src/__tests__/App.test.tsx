// app.test.js
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import {
	BrowserRouter,
	MemoryRouter,
	RouterProvider,
	createBrowserRouter,
	createMemoryRouter,
} from 'react-router-dom'
import { LocationDisplay, routesConfig } from 'services/routes'
import App from 'App'
export const renderWithRouter = (route = '/') => {
	window.history.pushState({}, 'Test page', route)
	return {
		user: userEvent.setup(),
		...render(<RouterProvider router={createBrowserRouter(routesConfig)} />),
	}
}
test('должен показывать fallback при загрузке', async () => {
	// const { findByText } = render(<App />, document.body)
	const router = createMemoryRouter(routesConfig, {
		initialEntries: ['/loggin'],
	})

	// act(() => {
	render(<RouterProvider router={router} />)
	// })
	// renderWithRouter()
	expect(screen.getByText(/Oops!/i)).toBeInTheDocument()
	// expect(await findByText('Oops!')).toBeInTheDocument()
	// make assertions, await changes, etc...
})
test('should navigate to login page on click', async () => {
	const router = createMemoryRouter(routesConfig, {
		initialEntries: ['/login'],
	})
	await act(async () => {
		render(<RouterProvider router={router} />)
	})
	expect(screen.getByText(/Войти/i)).toBeInTheDocument()
})

test('rendering a component that uses useLocation', async () => {
	const route = '/login'

	const { findByTestId } = render(
		<MemoryRouter initialEntries={[route]}>
			<LocationDisplay />
		</MemoryRouter>
	)

	const locationDisplay = await findByTestId('location-display')

	expect(locationDisplay).toBeInTheDocument()
})
