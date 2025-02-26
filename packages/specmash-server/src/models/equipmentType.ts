import {
	Association,
	CreationOptional,
	DataTypes,
	HasManyGetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import { sequelize } from '../db'
import { Equipment } from './equipment'
import { User } from './user'

export class EquipmentType extends Model<
	InferAttributes<EquipmentType>,
	InferCreationAttributes<EquipmentType>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare drivingLicenseCategory: string | null
	declare comment: string | null
	declare getEquipments: HasManyGetAssociationsMixin<Equipment>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date>

	static async createDefaults() {
		const defaultEquipmentTypes = [
			{
				name: 'Фронтальный погрузчик бол.',
				drivingLicenseCategory: 'Dt',
			},
			{
				name: 'Фронтальный погрузчик мал.',
				drivingLicenseCategory: 'Ct',
			},
			{
				name: 'Самосвал',
				drivingLicenseCategory: 'C',
			},
			{
				name: 'Бульдозер',
				drivingLicenseCategory: 'Et',
			},
			{
				name: 'Экскаватор гусеничный',
				drivingLicenseCategory: 'Et',
			},
			{
				name: 'Экскаватор колесный',
				drivingLicenseCategory: 'Dt',
			},
			{
				name: 'Трактор',
				drivingLicenseCategory: 'Ct',
			},
			{
				name: 'Самопогрузчик (воровайка)',
				drivingLicenseCategory: 'C',
			},
			{
				name: 'Легковой автомобиль',
				drivingLicenseCategory: 'B',
			},
			{
				name: 'Автобус',
				drivingLicenseCategory: 'D',
			},
		]
		for (const eqType of defaultEquipmentTypes) {
			const [newUser] = await EquipmentType.findOrCreate({
				where: { name: eqType.name },
				defaults: eqType,
			})
		}
	}
}

EquipmentType.init(
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
			unique: 'name',
		},
		drivingLicenseCategory: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
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
		tableName: 'equipmentType',
		sequelize,
		paranoid: true,
	}
)
