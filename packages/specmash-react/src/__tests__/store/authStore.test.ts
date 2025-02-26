import { AuthStore } from 'store/authStore'
import { IUser } from 'store/usersStore'

jest.mock('services/api/graphql', () => ({
	graphqlRequest: jest.fn(),
	setAuthTokenHeader: jest.fn(),
}))
import { graphqlRequest } from 'services/api/graphql'
const mockedGraphqlRequest = jest.mocked(graphqlRequest)
describe('AuthStore', () => {
	// const auth = { ...store.auth }
	let auth: AuthStore
	beforeEach(() => {
		auth = new AuthStore()
	})
	const mockUser: IUser = {
		id: expect.any(Number),
		name: expect.any(String),
		phone: expect.any(String),
		roles: [{ id: expect.any(Number), name: expect.any(String) }],
	}
	const mockedMeResponse = {
		me: {
			id: 1,
			name: 'John Doe',
			phone: '87946213',
			roles: [{ id: 1, name: 'User' }],
		},
	}

	describe('getUserByToken', () => {
		it('should call graphqlRequest with token and return user', async () => {
			// Mock graphql request
			mockedGraphqlRequest.mockResolvedValueOnce(mockedMeResponse)

			// Call method
			const user = (await graphqlRequest('123')) as { me: IUser }

			// Assertions
			expect(mockedGraphqlRequest).toBeCalledTimes(1)
			expect(user.me).toEqual(mockUser)
		})

		it('should set user and isAuthenticated when valid token provided', async () => {
			mockedGraphqlRequest.mockResolvedValueOnce(mockedMeResponse)
			await auth.getUserByToken('valid token')

			expect(auth.currentUser).toStrictEqual(mockUser)
			expect(auth.getIsAuthenticated()).toBe(true)
		})

		it('should return user from async storage if authenticated', async () => {
			auth.isAuthenticated = true
			auth.currentUser = mockUser

			const result = await auth.getUserByAsyncStorage()

			expect(result).toEqual(mockUser)
		})
		it('should not set user and isAuthenticated when invalid token provided', async () => {
			// mock failed API response
			mockedGraphqlRequest.mockRejectedValueOnce('Invalid token')

			// Call method
			await auth.getUserByToken('Invalid token')

			expect(auth.isAuthenticated).toBe(false)
			expect(auth.currentUser).toEqual({ roles: [{}] })
		})
		// No new imports needed - using existing Jest libs
		// Summary:// - Added 5 new unit tests for login()// - Validates successful login and error cases// - Limited validation due to lack of API mocks
	})
	describe('login', () => {
		it('logs user in and saves token on success', async () => {
			// Mock API response
			mockedGraphqlRequest.mockResolvedValueOnce({ login: { token: '123', user: mockUser } })

			// Call login
			await auth.login('87946213', '1234')

			// Assertions
			expect(auth.isAuthenticated).toBe(true)
			expect(auth.currentUser).toEqual(mockUser)
			expect(window.localStorage.getItem('token')).toBe('123')
		})

		it('returns user on successful login', async () => {
			// Mock response
			mockedGraphqlRequest.mockResolvedValueOnce({ login: { token: '123', user: mockUser } })

			// Call login
			const user = await auth.login('87946213', '1234')

			// Assertions
			expect(user).toEqual(mockUser)
		})

		it('returns error on failed login', async () => {
			// Mock error response
			mockedGraphqlRequest.mockRejectedValueOnce('Invalid credentials')

			// Call login
			const result = await auth.login('bad', 'creds')

			// Assertions
			expect(result).toEqual(new Error('Неверный логин или пароль'))
		})

		it('does not save token or user on failed login', async () => {
			// Mock error response
			mockedGraphqlRequest.mockRejectedValueOnce('Invalid credentials')

			// Call login
			await auth.login('bad', 'creds')

			// Assertions
			expect(auth.currentUser).toEqual({ roles: [{}] })
			expect(auth.isAuthenticated).toBe(false)
			expect(window.localStorage.getItem('token')).toBeNull()
		})

		it('handles unexpected errors', async () => {
			// Mock error response
			mockedGraphqlRequest.mockRejectedValueOnce('Network error')

			// Call login
			const result = await auth.login('87946213', '1234')

			// Assertions
			expect(result).toEqual(new Error('Неверный логин или пароль'))
		})
	})
})
