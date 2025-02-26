// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import React from 'react'
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

global.matchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}))
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // Deprecated
		removeListener: jest.fn(), // Deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
})
jest.mock('antd', () => {
	return {
		addListener: jest.fn(),
		Typography: {
			Text: jest.fn(),
		},
		Layout: {
			Sider: jest.fn(),
			Content: jest.fn(),
			Header: jest.fn(),
			Footer: jest.fn(),
		},
		Button: {
			Group: jest.fn(),
		},
		// Drawer: jest.fn((p) => p.children),
		// Space: jest.fn((p) => p.children),
	}
})
jest.mock('antd/es/typography/Title', () => {
	return {
		__esModule: true,
		default: 'Title',
	}
})
jest.mock('antd/es/typography/Link', () => {
	return {
		__esModule: true,
		default: 'Link',
	}
})
jest.mock('react-router-dom', () => {
	const originalModule = jest.requireActual('react-router-dom')

	return {
		__esModule: true,
		...originalModule,

		useNavigate: jest.fn(),
		useParams: jest.fn(),
		// useLocation: jest.fn(),

		// другие хуки которые используются в проекте
	}
})
jest.mock('node-fetch', () => {
	return jest.fn()
})

// jest.mock('localStorage', () => {
// 	let store = {} as Record<string, string>

// 	return {
// 		getItem: jest.fn((key) => store[key]),
// 		setItem: jest.fn((key, value) => {
// 			store[key] = value.toString()
// 		}),
// 		clear: jest.fn(() => {
// 			store = {}
// 		}),
// 	}
// // })
// jest.mock('services/api/graphql', () => {
// 	return {
// 		graphqlRequest: jest.fn().mockResolvedValue({
// 			me: {
// 				id: 1,
// 				name: 'John Doe',
// 				phone: '87946213',
// 				roles: [{ id: 1, name: 'User' }],
// 			},
// 		}),
// 		// graphqlRequest: (value: { query: string }) => {
// 		// 	if (value.query === 'me') {
// 		// 		return jest.fn().mockResolvedValue({
// 		// 			me: {
// 		// 				id: 1,
// 		// 				name: 'John Doe',
// 		// 				phone: '87946213',
// 		// 				roles: [{ id: 1, name: 'User' }],
// 		// 			},
// 		// 		})
// 		// 	}
// 		// },
// 	}
// })
jest.mock('antd', () => {
	const antd = jest.requireActual('antd')

	const Layout = ({ children = '' }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Layout.displayName = 'Layout'

	const Header = ({ children = '' }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Header.displayName = 'Header'

	const Content = ({ children = '' }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Content.displayName = 'Content'

	const Footer = ({ children = '' }: MyComponentProps) => {
		return <div>{children}</div>
	}

	Footer.displayName = 'Footer'
	Layout.Header = Header
	Layout.Content = Content
	Layout.Footer = Footer

	return {
		...antd,
		Layout,
	}
})
interface MyComponentProps {
	children?: React.ReactNode
}
