// import { Model } from 'workPlaceion'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
// import { knex } from '../db'
import { Role } from './role'
import logger from '../config/logger'
import { sequelize } from '../db'
import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
} from 'sequelize'
import { EquipmentType } from './equipmentType'
import { TravelLog } from './travelLog'

const signingKey = process.env.JWT_SECRET || 'secret'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>
	declare name: string
	declare nickname: string | null
	declare phone: string
	declare password: string
	declare comment: string | null
	declare getRoles: BelongsToManyGetAssociationsMixin<Role>
	declare setRoles: BelongsToManySetAssociationsMixin<Role, number>
	declare addRole: BelongsToManySetAssociationsMixin<Role, number>
	isActive() {
		return !this.isSoftDeleted()
	}
	static generatePassword() {
		/**
		 * !> Генерирует случайный пароль
		 * ? Длина пароля по умолчанию 6 символов
		 * ? Набор символов:
		 * - буквы латинского алфавита в верхнем и нижнем регистре
		 * - цифры
		 *
		 * !> Алгоритм:
		 * 1. Задаётся длина пароля length
		 * 2. Задаётся набор символов charset
		 * 3. Цикл от 0 до длины пароля
		 * 4. На каждой итерации берётся случайный символ из набора
		 * 5. Складывается в строку retVal
		 * 6. Возвращается сгенерированный пароль
		 */
		let length = 6,
			charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			retVal = ''
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n))
		}
		return retVal
	}

	/**
	 * ! Проверяет аутентификацию пользователя по JWT токену
	 * @param {string} token - JWT токен
	 * @param {Object} opts - Дополнительные опции запроса
	 * TODO: Добавить валидацию токена
	 *
	 * ! Выполняет следующие действия:
	 * 1. Извлекает хеш из токена
	 * 2. Верифицирует хеш с помощью ключа подписи
	 * 3. Если payload является строкой, возвращает ошибку
	 * 4. Ищет пользователя по идентификатору из payload
	 * 5. Возвращает найденного пользователя или null
	 */
	static async checkAuthByToken(token: string, opts?: any) {
		try {
			const hash = token.split(' ')[1]
			const payload = jwt.verify(hash, signingKey)
			if (typeof payload === 'string') {
				logger.error(payload)
				return new Error(payload)
			}
			const user = await User.findByPk(payload.id, { include: { all: true }, ...opts })
			if (user === null) {
				logger.error('Пользователь не найден')
				return new Error('Пользователь не найден')
			}
			return user
		} catch (error) {
			return new Error(error as string)
		}
	}

	/**
	 * Аутентифицирует пользователя и возвращает JWT токен
	 *
	 * @param {LoginInput} payload - Данные для входа: номер телефона и пароль
	 *
	 * @returns {Promise<{ token: string; user: User } | Error>} - Объект с JWT токеном и данными пользователя
	 * или ошибку аутентификации
	 */
	static async login(payload: LoginInput): Promise<{ token: string; user: User } | Error> {
		/** Ищет пользователя по номеру телефона из payload */
		const user = await User.findOne({ where: { phone: payload.phone }, include: { all: true } })
		if (!user) {
			return new Error('Пользователь не найден')
		}

		/** Сравнивает хеши паролей */
		const isValid = await compare(payload.password, user.password)
		if (!isValid) {
			return new Error('Неверный пароль')
		}

		/** Генерирует JWT токен */
		const token = jwt.sign({ id: user.id }, signingKey, {
			subject: payload.phone,
			expiresIn: '1d',
		})

		/** Возвращает токен и данные пользователя */
		return { token, user }
	}

	static async register(payload: RegisterUserInput) {
		const user = await User.findOne({ where: { phone: payload.phone } })
		if (user) {
			return new Error('Пользователь с таким номером телефона уже зарегистрирован')
		}
		const newUser = await User.create({
			name: payload.name,
			phone: payload.phone,
			password: payload.password,
		})
		return newUser
	}
	static async createDefaults() {
		const users = [
			{
				phone: '123',
				name: 'admin',
				password: '123', //'$2b$10$oeG6fHl5I/oPnnTBEYPKEuEKp/Cr3MUlTRIIqLsf4Dbg3p6ZS.8iW', // 123
				roles: [{ name: 'admin' }, { name: 'manager' }, { name: 'driver' }],
			},
			{
				phone: '1234',
				name: 'manager',
				password: '1234', //'$2b$10$oeG6fHl5I/oPnnTBEYPKEuEKp/Cr3MUlTRIIqLsf4Dbg3p6ZS.8iW', // 123
				roles: [{ name: 'manager' }, { name: 'driver' }],
			},
			{
				phone: '12345',
				name: 'driver',
				password: '12345', //'$2b$10$oeG6fHl5I/oPnnTBEYPKEuEKp/Cr3MUlTRIIqLsf4Dbg3p6ZS.8iW', // 123
				roles: [{ name: 'driver' }],
			},
		]
		for (const user of users) {
			const { roles, ...userData } = user
			const formattedRoles = []
			for (const role of roles) {
				const [currentRole] = await Role.findOrCreate({ where: { name: role.name } })
				formattedRoles.push(currentRole)
			}
			const [newUser] = await User.findOrCreate({
				where: { phone: user.phone },
				defaults: userData,
			})
			newUser.setRoles(formattedRoles)
		}
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING(25),
			allowNull: false,
			unique: 'phone',
			set(value: string) {
				let phone = value
				// Удаляем все не числовые символы
				phone = value.replace(/\D/g, '')

				// Если начинается с 8, заменяем на +7
				if (phone.startsWith('8')) {
					phone = '+7' + value.slice(1)
				}

				// Если начинается с 9, добавляем +7
				if (phone.startsWith('9') || phone.startsWith('384')) {
					phone = '+7' + value
				}
				this.setDataValue('phone', phone)
			},
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		comment: {
			type: DataTypes.TEXT('long'),
			allowNull: true,
		},
	},
	{
		tableName: 'users',
		modelName: 'User',
		sequelize,
		paranoid: true,
	}
)
User.beforeCreate(async (user) => {
	const userExists = await User.findOne({ where: { phone: user.phone } })
	if (userExists) {
		throw new Error('Пользователь с таким номером телефона уже зарегистрирован')
	}
	const password = await hash(user.password, 10)
	user.password = password
})
User.belongsToMany(Role, { through: 'UserRoles', as: 'roles' })
Role.belongsToMany(User, { through: 'UserRoles', as: 'users' })
User.belongsToMany(EquipmentType, {
	through: 'UserEquipmentTypes',
	as: 'equipmentTypes',
})
EquipmentType.belongsToMany(User, {
	through: 'UserEquipmentTypes',
	as: 'users',
})
TravelLog.belongsTo(User, { as: 'driver', foreignKey: 'driverId' })
User.hasMany(TravelLog)

export interface IUser extends Omit<IUserInput, 'roles' | 'equipmentTypes'> {
	id: number
	roles: Role[]
	equipmentTypes: EquipmentType[]
}
export interface IUserInput extends LoginInput {
	name: string
	roles: number[]
	equipmentTypes: number[]
	nickname?: string
	comment?: string
}

export interface RegisterUserInput extends LoginInput {
	name: string
}
export interface UserIdInput {
	input: {
		userId: number
	}
}

export interface LoginInput {
	phone: string
	password: string
}
export interface IUserFilter {
	input: IFilter
}
interface IFilter extends Partial<Omit<IUser, 'roles' | 'equipmentTypes'>> {
	limit?: number
	offset?: number
	search?: string
	roles?: number[]
	equipmentTypes?: number[]
}

// class User extends Model implements User {
// 	constructor(
// 		phone?: string,
// 		password?: string,
// 		id?: number,
// 		name?: string,
// 		nickname?: string,
// 		role?: string,
// 		isActive?: boolean,
// 		comment?: string
// 	) {
// 		super()
// 		this.id = id ?? 0
// 		// this.hash = hash ?? ''
// 		this.password = password ?? ''
// 		this.name = name ?? ''
// 		this.nickname = nickname ?? ''
// 		this.phone = phone ?? ''
// 		this.role = role ?? ''
// 		this.isActive = isActive ?? false
// 		this.comment = comment ?? ''
// 	}
// 	static async create(data: any) {
// 		try {
// 			const { password, phone, ...userData } = data
// 			// Добавление умолчаний
// 			userData.roleId = 3
// 			userData.isActive = false
// 			const isUserExists = await this.findByPhone(phone)
// 			if (isUserExists) {
// 				return Promise.reject(new Error('Пользователь с таким номером уже есть'))
// 			}
// 			const hashedPassword = await hash(password, 10)
// 			const newUser = await this.query().insert({
// 				...userData,
// 				phone,
// 				password: hashedPassword,
// 			})
// 			return newUser
// 		} catch (error: any) {
// 			logger.error(error)
// 			throw new Error(error)
// 		}
// 	}
// 	static async update({
// 		id,
// 		name,
// 		nickname,
// 		phone,
// 		password,
// 		role,
// 		isActive,
// 		comment,
// 	}: UpdateUserInput) {
// 		let userData: UserDbInput = {
// 			name,
// 			nickname,
// 			phone,
// 			isActive,
// 			comment,
// 			password,
// 			role,
// 		}

// 		if (password) {
// 			const hashedPassword = await hash(password, 10)
// 			userData.password = hashedPassword
// 		}
// 		console.log(userData)
// 		const rowResult = await this.query().update(userData).where({ id })
// 		if (rowResult > 0) {
// 			const newUser = await User.getUserById(id)
// 			return newUser
// 		}
// 		return new Error('Пользователь не обновлен')
// 	}

// 	static async login(phone: any, password: any) {
// 		const user = await User.getUserByPhone(phone, password)
// 		if (user instanceof Error) {
// 			return user
// 		}
// 		const { ...payload } = user
// 		// console.log('payload', payload)
// 		const token = await (jwt as any).sign(payload, signingKey, {
// 			subject: payload.id.toString(),
// 			expiresIn: '1d',
// 		})
// 		return token
// 	}
// 	static async getAll({ input }: IUserFilter = { input: {} }) {
// 		try {
// 			// console.log('userModel ', input)
// 			const { limit, offset, role, ...filter } = input
// 			const users = await User.query()
// 				.join('roles', 'users.roleId', 'roles.id')
// 				.select('users.*', 'roles.name as role')
// 				.where(filter)
// 				.where(role ? { 'roles.name': role } : {})
// 				.limit(limit || 100)
// 				.offset(offset || 0)
// 			return users
// 		} catch (error: any) {
// 			return new Error(error)
// 		}
// 	}
// 	static async getUserByHash(token: string) {
// 		const hash = token.split(' ')[1]
// 		const payload = jwt.verify(hash, signingKey)
// 		if (typeof payload === 'string') {
// 			return new Error(`${payload}`)
// 		}
// 		const user = await User.getUserById(payload.id)
// 		return user
// 	}
// 	async getHashByPhone() {
// 		try {
// 			const user = await User.findByPhone(this.phone)
// 			if (!user || user instanceof Error) {
// 				throw new Error('Пользователь не найден')
// 			}
// 			// this.hash = user.hash
// 		} catch (error: any) {
// 			return new Error(error)
// 		}
// 	}
// 	static roleToString = (user: User) => {}

// 	async passwordCompare(hash: string) {
// 		try {
// 			const user = await User.query().where({ id: this.id }).first()
// 			if (!user) {
// 				return new Error('Пользователь не найден')
// 			}
// 			return await compare(hash, user.password)
// 		} catch (error: any) {
// 			return new Error(error)
// 		}
// 	}

// 	static async isActive(userId: Number): Promise<boolean> {
// 		const { isActive } = await knex.select('isActive').from('users').where('id', userId).first()
// 		return isActive
// 	}

// 	static async getUserByPhone(phone: string, password: string): Promise<User | Error> {
// 		try {
// 			const user = await User.query()
// 				.join('roles', 'users.roleId', 'roles.id')
// 				.select('users.*', 'roles.name as role')
// 				.where({ phone })
// 				.first()
// 			if (!user) {
// 				return new Error('Пользователь не найден')
// 			}
// 			const isValid = await compare(password, user.password)
// 			if (!isValid) {
// 				return new Error('Неверный пароль')
// 			}
// 			return user
// 		} catch (error: any) {
// 			return error
// 		}
// 	}

// 	static async getUserById(id: Number) {
// 		try {
// 			const user = await User.query()
// 				.join('roles', 'users.roleId', 'roles.id')
// 				.select('users.*', 'roles.name as role')
// 				.where({ 'users.id': id })
// 				.first()
// 			// console.log('getUserById', user)
// 			if (!user) {
// 				return new Error('Пользователь не найден')
// 			}
// 			return user
// 		} catch (error: any) {
// 			return new Error(error)
// 		}
// 	}

// 	static async findByPhone(phone: string) {
// 		try {
// 			const user = await this.query().where({ phone }).first()
// 			if (!user) {
// 				return null
// 			}
// 			return user
// 		} catch (error: any) {
// 			return new Error(error)
// 		}
// 	}
// 	public async save(): Promise<User> {
// 		return User.query().updateAndFetchById(this.id, this)
// 	}

// 	static async toggleUserActive(userId: number) {
// 		const user = await this.query().findById(userId)
// 		if (user) {
// 			user.isActive = !user.isActive
// 			await user.save()
// 			return user.isActive
// 		}
// 		return new Error('Пользователь не найден')
// 	}

// 	static get tableName() {
// 		return 'users'
// 	}

// 	static get idColumn() {
// 		return 'id'
// 	}

// 	static get jsonSchema() {
// 		return {
// 			type: 'workPlace',
// 			required: ['name', 'phone', 'role'],

// 			properties: {
// 				id: { type: 'integer' },
// 				name: { type: 'string', minLength: 1, maxLength: 255 },
// 				nickname: { type: 'string', maxLength: 255 },
// 				phone: { type: 'string', minLength: 3, maxLength: 25 },
// 				role: { type: 'string', minLength: 1, maxLength: 30 },
// 				password: { type: 'string', minLength: 1, maxLength: 255 },
// 				isActive: { type: 'boolean' },
// 				comment: { type: 'string', maxLength: 255 },
// 			},
// 		}
// 	}

// 	static get relationMappings() {
// 		return {
// 			role: {
// 				relation: Model.BelongsToOneRelation,
// 				modelClass: Role,
// 				join: {
// 					from: 'users.roleId',
// 					to: 'roles.id',
// 				},
// 			},
// 		}
// 	}
// }
// export default User
