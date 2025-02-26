import { GraphQLError } from 'graphql'
import { resolverPermissions } from '.'
import { User, LoginInput, UserIdInput, IUser, IUserFilter } from '../models/user'
import { Role } from '../models/role'
import { Op } from 'sequelize'
import { EquipmentType } from '../models/equipmentType'

export const UserResolver = {
	/**
	 * Query resolver for User model
	 */
	Query: {
		/**
		 * Get paginated list of users with filtering, sorting and relations
		 *
		 * @param {Object} parent - Parent object
		 * @param {Object} input - Filtering, sorting and pagination input
		 * @param {Object} ctx - GraphQL context
		 * @returns {Promise<Object>} Promise resolving to paginated user list
		 */
		users: async (parent: any, { input }: IUserFilter, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const { limit = 100, offset, search, roles, equipmentTypes, ...other } = input
				const users = await User.findAndCountAll({
					distinct: true,
					where: {
						...other,
						[Op.or]: [
							{
								name: {
									[Op.substring]: search ? `%${search}%` : '%%',
								},
							},
							{
								phone: {
									[Op.substring]: search ? `%${search}%` : '%%',
								},
							},
							{
								comment: {
									[Op.substring]: search ? `%${search}%` : '%%',
								},
							},
							{
								nickname: {
									[Op.substring]: search ? `%${search}%` : '%%',
								},
							},
						],
					},
					include: [
						{
							model: Role,
							as: 'roles',
							where: roles
								? {
										id: {
											[Op.or]: roles,
										},
								  }
								: undefined,
							required: !!roles,
						},
						{
							model: EquipmentType,
							as: 'equipmentTypes',
							where: equipmentTypes
								? {
										id: {
											[Op.or]: equipmentTypes,
										},
								  }
								: undefined,
							required: !!equipmentTypes,
						},
					],
					limit,
					offset,
				})
				return users
			}
			return new GraphQLError('Не достаточно прав доступа')
		},

		/**
		 * Get user by ID with role relations
		 *
		 * @param {Object} parent - Parent object
		 * @param {number} id - User ID
		 * @param {Object} ctx - GraphQL context
		 * @returns {Promise<Object>} Promise resolving to User instance
		 */
		user: async (parent: any, { id }: { id: number }, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const user = await User.findByPk(id, {
					include: [
						{
							model: Role,
							as: 'roles',
						},
					],
				})
				return user
			}
			return new GraphQLError('Не достаточно прав доступа')
		},

		/**
		 * Get all roles
		 *
		 * @returns {Promise<Object[]>} Promise resolving to list of all roles
		 */
		roles: async () => {
			// получить роли из БД
			const roles = await Role.findAll()
			return roles
		},

		/**
		 * Find user by phone number
		 *
		 * @param {Object} _ - Parent object
		 * @param {string} phone - User phone number
		 * @returns {Promise<Object>} Promise resolving to user
		 */
		findByPhone: async (_: any, { phone }: { phone: string }) => {
			const user = await User.findOne({ where: { phone } })
			return user
		},
	},

	Mutation: {
		createUser: async (parent: any, { input }: { input: Omit<IUser, 'password'> }, ctx: any) => {
			try {
				const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
				if (userHasPermissions) {
					const password = User.generatePassword()
					const { roles, ...other } = input
					const payload = { ...input, password }
					const user = await User.create(payload, { include: [{ model: Role, as: 'roles' }] })
					return user
				}
				return new GraphQLError('Недостаточные права доступа').toJSON()
			} catch (error: any) {
				return new GraphQLError(error.message)
			}
		},
		updateUser: async (parent: any, { input }: { input: Partial<IUser> }, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const user = input.id
					? await User.findByPk(input.id)
					: await User.findOne({ where: { phone: input.phone } })
				if (!user) {
					return new GraphQLError('Пользователь не найден')
				}
				const newUser = await user.update(input)
				return newUser
			}
			return new GraphQLError('Недостаточно прав')
		},
	},
}
