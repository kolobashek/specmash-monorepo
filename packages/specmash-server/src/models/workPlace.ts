import {
	Association,
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import { sequelize } from '../db'
import { Partner } from './partner'

export class WorkPlace extends Model<
	InferAttributes<WorkPlace>,
	InferCreationAttributes<WorkPlace>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare address: CreationOptional<string>
	declare comment: CreationOptional<string>
	declare contacts: CreationOptional<string>
	declare getPartners: BelongsToManyGetAssociationsMixin<Partner>
	declare setPartners: BelongsToManySetAssociationsMixin<Partner, number>
	declare addPartner: BelongsToManySetAssociationsMixin<Partner, number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date>
	declare static associations: {
		type: Association<WorkPlace, Partner>
	}
}
WorkPlace.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'name',
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		comment: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		contacts: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		modelName: 'workPlaces',
		sequelize,
		paranoid: true,
	}
)
WorkPlace.beforeCreate(async (workPlace) => {
	const workPlaceExists = await Partner.findOne({ where: { name: workPlace.name } })
	if (workPlaceExists) {
		throw new Error('Объект с таким названием уже зарегистрирован')
	}
})
Partner.beforeCreate(async (partner) => {
	const partnerExists = await Partner.findOne({ where: { name: partner.name } })
	if (partnerExists) {
		throw new Error('Контрагент с таким названием уже зарегистрирован')
	}
})
Partner.belongsToMany(WorkPlace, { through: 'PartnerWorkPlace', as: 'workPlaces' })
WorkPlace.belongsToMany(Partner, { through: 'PartnerWorkPlace', as: 'partners' })

export interface WorkPlaceAttributes extends WorkPlaceAttributesInput {
	id: number
}
export interface WorkPlaceAttributesInput {
	name: string
	contacts?: string
	address?: string
	partners?: number[]

	// [key: string]: string | undefined | number | number[]
}
