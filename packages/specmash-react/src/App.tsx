import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routesConfig } from './services/routes'
import { AppLayout } from './components'

const router = createBrowserRouter(routesConfig)

const App = () => {
	return (
		<RouterProvider
			router={router}
			fallbackElement={
				<AppLayout>
					<p>Initial Load...</p>
				</AppLayout>
			}
		/>
	)
}

export default App
