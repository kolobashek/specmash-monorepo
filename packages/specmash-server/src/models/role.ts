import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db'
import { User } from './user'

export class Role extends Model {
	declare id: number
	declare name: string
	declare comment: string | null
	// constructor(name: string, id: number) {
	// 	super()
	// 	this.name = name
	// 	this.id = id
	// }
	// id
	// name
	// static get tableName() {
	// 	return 'roles'
	// }
	// static getRoleById = async (id: number) => {
	// 	try {
	// 		const role = await this.query().findById(id)
	// 		return role
	// 	} catch (error) {
	// 		return Promise.reject(error)
	// 	}
	// }
	// static getByName = async (name: string) => {
	// 	try {
	// 		const role = await this.query().select('name').where({ name }).first()
	// 		if (role) {
	// 			return role
	// 		}
	// 		return new Role('UNDEFINED', 4)
	// 	} catch (error) {
	// 		return Promise.reject(error)
	// 	}
	// }
	// static getAll = async () => {
	// 	const allRoles = await this.query().select('name')
	// 	return allRoles.map((role) => role.name)
	// }
	// static get jsonSchema() {
	// 	return {
	// 		type: 'string',
	// 		enum: ['admin', 'manager', 'driver', 'UNDEFINED'],
	// 		default: 'driver',
	// 	}
	// }
}

Role.init(
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
			unique: 'name',
			allowNull: false,
		},
		comment: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	},
	{
		modelName: 'role',
		sequelize,
		paranoid: true,
	}
)
