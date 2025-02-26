import { WorkPlace } from './workPlace'
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
import { TravelLog } from './travelLog'

export class Partner extends Model<InferAttributes<Partner>, InferCreationAttributes<Partner>> {
	declare id: CreationOptional<number>
	declare name: string
	declare address: CreationOptional<string>
	declare comment: CreationOptional<string>
	declare contacts: CreationOptional<string>
	declare getWorkPlaces: BelongsToManyGetAssociationsMixin<WorkPlace>
	declare setWorkPlaces: BelongsToManySetAssociationsMixin<WorkPlace, number>
	declare addWorkPlace: BelongsToManySetAssociationsMixin<WorkPlace, number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date>
	declare static associations: {
		type: Association<WorkPlace, Partner>
	}
}

Partner.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contacts: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		comment: {
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
		modelName: 'partners',
		sequelize,
		paranoid: true,
	}
)

export interface PartnerAttributes extends PartnerAttributesInput {
	id: number
}
export interface PartnerAttributesInput {
	name: string
	contacts?: string
	address?: string
	workPlaces?: IWorkPlace[]

	[key: string]: string | undefined | number | IWorkPlace[]
}

interface IWorkPlace {
	id: number
	name: string
}
