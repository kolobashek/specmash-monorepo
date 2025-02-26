import { GraphQLError } from 'graphql'
import { resolverPermissions } from '.'
import { TravelLog, CreateTravelLogPayload, UpdateTravelLogPayload } from '../models/travelLog'

export const TravelLogResolver = {
	Query: {
		travelLogs: async (parent: any, args: any, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				// получить путевые листы из БД
				const travelLogs = await TravelLog.findAll({
					include: ['driver', 'equipment', 'workPlace', 'partner'],
				})
				return travelLogs
			}
			return new GraphQLError('Недостаточные права доступа')
		},
		travelLog: async (parent: any, { id }: { id: number }, ctx: any) => {},
	},
	Mutation: {
		createTravelLog: async (parent: any, { input }: CreateTravelLogPayload, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const payload = {
					...input,
					// driverId: input.driver?.id,
					// equipmentId: input.equipment.id,
					// workPlaceId: input.workPlace?.id,
					// partnerId: input.partner?.id,
				}
				const travelLog = await TravelLog.create(payload)
				return travelLog
			}
			return new GraphQLError('Недостаточные права доступа')
		},
		updateTravelLog: async (parent: any, { input }: UpdateTravelLogPayload, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const updatedTravelLog = await TravelLog.findByPk(input.id)
				if (updatedTravelLog) {
					const payload = {
						...input,
						// driverId: input.driver?.id,
						// equipmentId: input.equipment.id,
						// workPlaceId: input.workPlace?.id,
						// partnerId: input.partner?.id,
					}
					const travelLog = await updatedTravelLog.update(payload)
					return travelLog
				}
				return updatedTravelLog
			}
			return new GraphQLError('Недостаточные права доступа')
		},
	},
}
