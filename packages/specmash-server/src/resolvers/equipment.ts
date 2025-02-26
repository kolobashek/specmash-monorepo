import { GraphQLError } from 'graphql'
import { resolverPermissions } from '.'
import { Equipment, UpdateEquipmentInput } from '../models/equipment'
import { EquipmentType } from '../models/equipmentType'
import { CreationAttributes } from 'sequelize'

export const EquipmentResolver = {
	Query: {
		getEquipmentTypes: async () => {
			const types = await EquipmentType.findAll()
			return types
		},
		equipments: async () => {
			const equipments = await Equipment.findAll({
				include: [{ model: EquipmentType, as: 'type' }],
			})
			return equipments
		},
		equipment: async (parent: any, { id }: { id: number }, ctx: any) => {
			const equipment = await Equipment.findByPk(id, {
				include: [{ model: EquipmentType, as: 'type' }],
			})
			return equipment
		},
	},
	Mutation: {
		createEquipment: async (
			parent: any,
			{ input }: { input: CreationAttributes<Equipment> },
			ctx: any
		) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				// console.log('input', input)
				const newEquipment = await Equipment.create(input, {
					include: [
						{
							model: EquipmentType,
							as: 'type',
						},
					],
				})
				return newEquipment
			}
			return new GraphQLError('Недостаточные права доступа')
		},
		updateEquipment: async (parent: any, { input }: { input: UpdateEquipmentInput }, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const equipment = await Equipment.findByPk(input.id)
				if (equipment) {
					await equipment.update(input)
				}
				// console.log(equipment)
				return equipment
			}
			return new GraphQLError('Недостаточно прав')
		},
	},
}
