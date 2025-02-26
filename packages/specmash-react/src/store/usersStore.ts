import { makeAutoObservable, runInAction } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { localizedRoleName } from '../utils'

class UsersStore {
	list = [] as IUser[]
	userData = {
		roles: [] as IRole[],
	} as IUserData
	roles = [] as IRole[]
	currentUser: IUser | null = null
	usersFilter = { limit: 1000, offset: 0 } as IUsersFilter

	constructor() {
		makeAutoObservable(this)
		this.getRoles()
	}
	getUsers = async (filter?: IUsersFilter) => {
		try {
			const users = (await graphqlRequest(Queries.getUsers, {
				input: { ...this.usersFilter, ...filter },
			})) as UsersResponse | Error
			if (users instanceof Error) {
				return users
			}
			this.setUsersList(users.users.rows)
			return users.users
		} catch (error) {
			return new Error(error as string)
		}
	}
	setUsersList = (users: IUser[]) => {
		this.list = users
	}
	roleName = (role: string | number | undefined) => {
		if (!role) return null
		return localizedRoleName(role)
	}
	getUserById = async (id: number) => {
		try {
			const user = (await graphqlRequest(Queries.getUserById, { id })) as UserResponse | Error
			if (user instanceof Error) {
				return user
			}
			runInAction(() => {
				this.currentUser = user.user
			})
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
			runInAction(() => {
				this.roles = roles.roles
			})
			return roles.roles
		} catch (error) {
			return new Error(error as string)
		}
	}
	setUserData = ({ phone, name, nickname, comment, roles }: IUserData) => {
		// console.log(comment)
		phone = phone ?? this.userData.phone ?? ''
		name = name ?? this.userData.name ?? ''
		nickname = nickname ?? this.userData.nickname ?? ''
		comment = comment ?? this.userData.comment ?? ''
		roles = roles ?? this.userData.roles ?? [{ id: 0, name: '' }]

		this.userData.phone = phone
		this.userData.name = name
		this.userData.nickname = nickname
		this.userData.comment = comment
		this.userData.roles = roles
	}
	setCurrentUser = (user: IUser | null) => {
		this.currentUser = user
	}
	setUserFilter = (filter: Partial<IUsersFilter>) => {
		this.usersFilter = {
			...this.usersFilter,
			...filter,
		}
	}
	clearUserData = () => {
		this.userData = {
			roles: [] as IRole[],
		} as IUserData
	}
	createUser = async (userData: Omit<IUser, 'id'>) => {
		try {
			let payload = { ...userData, roles: [] as number[] }
			if (userData.roles?.length) {
				const roles = userData.roles.map((role) => role.id)
				payload = { ...userData, roles }
			}
			const response = (await graphqlRequest(Queries.createUser, { input: payload })) as
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
	userSearch = async (text: string) => {
		try {
			const response = (await graphqlRequest(Queries.getUsers, { search: text })) as
				| UsersResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.users.rows
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
	roles: IRole[]
}
export interface IUserData {
	phone?: string
	name?: string
	nickname?: string
	comment?: string
	roles?: IRole[]
}
export interface IRole {
	id: number
	name: string
}
interface GetUsersPayloadInput {
	id?: number
	phone?: string
	name?: string
	limit?: number
	offset?: number
	roles?: number[]
}
interface UserResponse {
	user: IUser
}
interface UsersResponse {
	users: {
		count: number
		rows: IUser[]
	}
}
interface UpdateUserResponse {
	updateUser: IUser
}
interface ICreateUserResponse {
	createUser: IUser
}
interface RolesResponse {
	roles: IRole[]
}
interface IUsersFilter {
	phone?: string
	name?: string
	roles?: number[]
	limit?: number
	offset?: number
	deleted?: boolean
	createdAt?: string
	sort?: string
	order?: string
	search?: string
}
