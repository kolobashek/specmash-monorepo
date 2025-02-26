jest.mock('antd', () => {
	const antd = jest.requireActual('antd')

	const Layout = ({ children }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Layout.displayName = 'Layout'

	const Header = ({ children }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Header.displayName = 'Header'

	const Content = ({ children }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Content.displayName = 'Content'

	const Footer = ({ children }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Footer.displayName = 'Footer'

	return {
		...antd,
		Layout,
		Header,
		Content,
		Footer,
	}
})

import React from 'react'
import { createRoot } from 'react-dom/client'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppLayout } from 'components/UIkit/AppLayout'
import store from 'store'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import App from 'App'

// No new imports needed - using existing React Testing Library
// Summary:
// - Added 3 tests for AppLayout component
// - Validates header, footer, content rendered
// - Checks auth.getUserByAsyncStorage called on mount
const customRender = (ui: React.ReactElement, options = {}) =>
	render(ui, {
		wrapper: ({ children }) => children,
		...options,
	})
describe('AppLayout', () => {
	it('renders without crashing', () => {
		const container = document.getElementById('app')
		const root = createRoot(container!)
		// const div = document.createElement('div')
		root.render(<App />)
	})
	it('renders header, content, footer', () => {
		const { container } = render(<AppLayout />)
		const button = container.querySelector('button')
		button && fireEvent.click(button)

		expect(screen.getByRole('header')).toBeInTheDocument()
		expect(screen.getByRole('contentinfo')).toBeInTheDocument()
		expect(screen.getByRole('main')).toBeInTheDocument()
	})

	it('calls auth.getUserByAsyncStorage on mount', () => {
		const mockGetUser = jest.fn()
		jest.spyOn(auth, 'getUserByAsyncStorage').mockImplementation(mockGetUser)

		render(<AppLayout />)

		expect(mockGetUser).toHaveBeenCalledTimes(1)
	})
	// it('renders children in content', () => {
	// 	render('Test Child')
	// 	expect(screen.getByText('Test Child')).toBeInTheDocument()
	// })
})
interface MyComponentProps {
	children: React.ReactNode
}
