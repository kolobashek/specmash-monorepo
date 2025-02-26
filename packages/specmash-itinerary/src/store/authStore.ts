import { isActive } from './../services/api/user'
import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { graphqlRequest, setAuthTokenHeader } from '../services/api/graphql'

class AuthStore {
	userAuthorized = false
	declare registrationMessage: string
	declare token: string
	declare currentUser: IUser

	constructor() {
		makeAutoObservable(this)
	}

	// getTokenFromAsyncStorage = async () => {
	// 	const result = await AsyncStorage.getItem('token')
	// 	if (result) {
	// 		this.token = result
	// 		setAuthTokenHeader(result)
	// 		const currentUser = await graphqlRequest(Queries.me, {}, { token: result })
	// 		console.log(currentUser)
	// 		if (currentUser?.me) this.currentUser = currentUser.me
	// 		return result
	// 	}
	// 	return new Error('Токен не найден')
	// }
	getUserByToken = async (token: string): Promise<IUser | Error> => {
		try {
			setAuthTokenHeader(token)
			const request = (await graphqlRequest(Queries.me, {}, { token })) as UserResponse
			const user = request.me
			if (user) {
				this.setCurrentUser(user)
				this.setUserAuthorized(true)
				return user
			} else {
				this.setUserAuthorized(false)
				return new Error('Токен не действителен')
			}
		} catch (error) {
			return new Error(error as string)
		}
	}
	getUserByAsyncStorage = async (): Promise<IUser | Error> => {
		if (this.userAuthorized) {
			return this.currentUser
		} else {
			try {
				const token = await AsyncStorage.getItem('token')
				if (!token) {
					this.userAuthorized = false
					return new Error('Токен не найден')
				} else {
					setAuthTokenHeader(token)
					const request = (await graphqlRequest(Queries.me, {}, { token })) as UserResponse
					const user = request.me
					if (user) {
						this.setCurrentUser(user)
						this.setUserAuthorized(true)
						return user
					} else {
						this.setUserAuthorized(false)
						return new Error('Токен не действителен')
					}
				}
			} catch (error) {
				return new Error(error as string)
			}
		}
	}

	login = async (phone: string, password: string) => {
		try {
			const { login } = (await graphqlRequest(Queries.login, {
				phone,
				password,
			})) as Login
			this.token = login.token
			this.setCurrentUser(login.user)
			await AsyncStorage.setItem('token', login.token)
			return login.user
		} catch (error) {
			return new Error('Неверный логин или пароль')
		}
	}

	setUserAuthorized = (authorized: boolean) => {
		this.userAuthorized = authorized
	}

	getRegistrationMessage = () => {
		return this.registrationMessage
	}

	setRegistrationMessage = (message: string) => {
		this.registrationMessage = message
	}

	setCurrentUser = (user: IUser) => {
		this.currentUser = user
	}

	hasRoles = (...roleNames: string[]) => {
		const roles = this.currentUser.roles
		if (roles) {
			for (const roleName of roleNames) {
				if (roles.some((role) => role.name === roleName)) {
					return true
				}
			}
		}
		return false
	}
}

export default new AuthStore()

interface IUser {
	comment?: string
	id: number
	isActive: boolean
	name?: string
	nickname?: string
	password: string
	phone: string
	roles: IRole[]
}
interface IRole {
	id: number
	name: string
}
interface UserResponse {
	me: IUser
}

interface Login {
	login: {
		token: string
		user: IUser
	}
}
