import {
	Association,
	BelongsToSetAssociationMixin,
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize'
import { sequelize } from '../db'
import { EquipmentType } from './equipmentType'
import { TravelLog } from './travelLog'

export class Equipment extends Model<
	InferAttributes<Equipment>,
	InferCreationAttributes<Equipment>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare dimensions: string | null
	declare weight: number | null
	declare licensePlate: string | null
	declare nickname: string | null
	declare typeId: ForeignKey<EquipmentType['id']>
	declare type?: NonAttribute<EquipmentType>
	declare setEquipmentType: BelongsToSetAssociationMixin<EquipmentType, number>
	declare comment: string | null
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date>
	declare static associations: {
		type: Association<Equipment, EquipmentType>
	}
}

Equipment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		licensePlate: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		nickname: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		weight: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},
		dimensions: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		// typeId: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: false,
		// },
		comment: {
			type: DataTypes.STRING(255),
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
		tableName: 'equipment',
		sequelize,
		paranoid: true,
	}
)
Equipment.belongsTo(EquipmentType, { foreignKey: 'typeId', as: 'type' })
TravelLog.belongsTo(Equipment, { as: 'equipment', foreignKey: 'equipmentId' })

// interface EquipmentAttributes extends EquipmentAttributesInput {
// 	id: number
// }

export interface UpdateEquipmentInput extends CreationOptional<Equipment> {
	id: number
}
