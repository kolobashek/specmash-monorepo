import React from 'react'
import { render } from '@testing-library/react'
import ErrorPage from 'errorPage'

jest.mock('react-router-dom', () => ({
	useRouteError: () => new Error('Test error'),
}))

describe('ErrorPage', () => {
	it('renders error message', () => {
		const { getByRole, getByText } = render(<ErrorPage />)

		expect(getByRole('heading')).toHaveTextContent('Oops!')
		expect(getByText(/test error/i)).toBeInTheDocument()
	})
})
