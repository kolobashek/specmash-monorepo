import { GraphQLError } from 'graphql'
import { resolverPermissions } from '.'
import { User, IUserInput, LoginInput, UserIdInput } from '../models/user'
import logger from '../config/logger'
/**
 * Authorization resolver
 */
export const AuthResolver = {
	Query: {
		/**
		 * Returns the current authenticated user
		 * @async
		 * @param {any} parent - Parent parameter
		 * @param {any} args - Arguments
		 * @param {any} ctx - Context object containing request headers
		 * @returns {Promise<User|GraphQLError>} - The authenticated user or a GraphQLError
		 */
		me: async (parent: any, args: any, ctx: any) => {
			/**
			 * @const {string} token - Get auth token from request headers
			 */
			const token: string = ctx.request.headers.headersInit.authorization // Get auth token from request headers
			if (token) {
				/**
				 * Verify token validity
				 * @async
				 * @function User.checkAuthByToken
				 * @param {string} token - Auth token
				 * @returns {Promise<User|Error>} - User object or Error
				 */
				const user = await User.checkAuthByToken(token) // Verify token validity
				if (user instanceof Error) {
					/**
					 * Return GraphQLError on invalid token
					 * @returns {GraphQLError} error
					 */
					console.log(user)
					return new GraphQLError(user.message) // Return error on invalid token
				}
				/**
				 * Return user on valid token
				 * @returns {User} user - Authenticated user
				 */
				return user // Return authenticated user
			}

			// console.log('token/resolvers', token)
			/**
			 * Return GraphQLError if user is not authenticated
			 * @returns {GraphQLError} error
			 */
			return new GraphQLError('Пользователь не авторизован')
		},
	},
	Mutation: {
		/**
		 * Регистрация пользователя
		 *
		 * @async
		 * @function register
		 * @param {Object} _ - Неиспользуемый параметр
		 * @param {Object} input - Объект с данными для регистрации пользователя
		 * @param {IUserInput} input.input - Объект с данными пользователя
		 * @returns {Promise<User>} - Объект пользователя или ошибку GraphQL
		 */
		register: async (_: any, { input }: { input: IUserInput }) => {
			try {
				/**
				 * Регистрация пользователя из базы данных
				 * @function User.register
				 * @param {IUserInput} input - Объект с данными пользователя
				 * @returns {Promise<User>} - Зарегистрированный пользователь
				 */
				const user = await User.register({ ...input })
				return user
			} catch (error: any) {
				/**
				 * Возвращение ошибки GraphQL при неудачной регистрации
				 * @param {String} error.message - Текст ошибки
				 */
				return new GraphQLError(error.message)
			}
		},

		login: async (parent: any, { phone, password }: LoginInput, ctx: any) => {
			// Функция логина пользователя
			const response = await User.login({ phone, password }) // Вызов метода логина
			if (response instanceof Error) {
				logger.error(response.message)
				return new GraphQLError('Неверный телефон или пароль')
			}
			// Установка куки с токеном
			ctx.request.cookieStore?.set({
				name: 'authorization',
				sameSite: 'strict',
				secure: true,
				domain: 'specmash.su',
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
				value: response.token,
				httpOnly: true,
			})
			return response
		},
	},
}
