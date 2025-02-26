import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'

class UsersStore {
	list: IUser[] | [] = []
	userData: IUserData = {
		phone: '',
		name: '',
		nickname: '',
		comment: '',
		role: '',
		isActive: false,
	}
	roles: string[] | [] = []
	currentUser: IUser | null = null

	constructor() {
		makeAutoObservable(this)
		this.getRoles()
	}
	getUsers = async (payload: GetUsersPayloadInput = {}) => {
		try {
			const users = (await graphqlRequest(Queries.getUsers, { input: payload })) as
				| UsersResponse
				| Error
			if (users instanceof Error) {
				return users
			}
			this.list = users.users
			return users.users
		} catch (error) {
			return new Error(error as string)
		}
	}
	roleName = (role: string | undefined) => {
		if (role === 'admin') return 'Администратор'
		if (role === 'manager') return 'Менеджер'
		if (role === 'user') return 'Водитель'
		return 'Не назначена'
	}
	getUserById = async (id: number) => {
		try {
			const user = (await graphqlRequest(Queries.getUserById, { id })) as UserResponse | Error
			if (user instanceof Error) {
				return user
			}
			this.currentUser = user.user
			return user.user
		} catch (error) {
			return new Error(error as string)
		}
	}
	getRoles = async () => {
		try {
			const roles = (await graphqlRequest(Queries.getRoles)) as RolesResponse | Error
			// console.log(types)
			if (roles instanceof Error) {
				return roles
			}
			this.roles = roles.roles
			return roles.roles
		} catch (error) {
			return new Error(error as string)
		}
	}
	setUserData = ({ phone, name, nickname, comment, role, isActive }: IUserData) => {
		console.log(comment)
		phone = phone ?? this.userData.phone ?? ''
		name = name ?? this.userData.name ?? ''
		nickname = nickname ?? this.userData.nickname ?? ''
		comment = comment ?? this.userData.comment ?? ''
		role = role ?? this.userData.role ?? ''
		isActive = isActive ?? this.userData.isActive ?? false

		this.userData.phone = phone
		this.userData.name = name
		this.userData.nickname = nickname
		this.userData.comment = comment
		this.userData.role = role
		this.userData.isActive = isActive
	}
	setCurrentUser(user: IUser | null) {
		this.currentUser = user
	}
	clearUserData = () => {
		this.userData = {
			phone: '',
			name: '',
			nickname: '',
			comment: '',
			role: '',
			isActive: false,
		}
	}
	createUser = async (userData: IUserData) => {
		try {
			const response = (await graphqlRequest(Queries.createUser, userData)) as
				| ICreateUserResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createUser
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateUser = async (input: IUser) => {
		try {
			const response = (await graphqlRequest(Queries.updateUser, { input })) as
				| UpdateUserResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.updateUser
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new UsersStore()

export interface IUser extends IUserData {
	id: number
	phone: string
	name: string
}
interface UsersResponse {
	users: IUser[]
}
interface UserResponse {
	user: IUser
}
interface UpdateUserResponse {
	updateUser: IUser
}
interface ICreateUserResponse {
	createUser: IUser
}
interface RolesResponse {
	roles: string[]
}
export interface IUserData {
	phone?: string
	name?: string
	nickname?: string
	comment?: string
	role?: string
	isActive?: boolean
}
interface GetUsersPayload {
	input: GetUsersPayloadInput
}
interface GetUsersPayloadInput extends Partial<IUser> {
	limit?: number
	offset?: number
}
