import { AuthResolver } from './auth'
import { TravelLogResolver } from './travelLogs'
import { WorkPlaceResolver } from './workPlace'
import { UserResolver } from './user'
import { EquipmentResolver } from './equipment'
import { PartnerResolver } from './partner'
import logger from '../config/logger'
import { User } from '../models/user'
import { Role } from '../models/role'

export const resolverPermissions = async (ctx: any, ...resolvedRoles: string[]) => {
	const token: string = ctx.request.headers.headersInit.authorization
	// console.log(ctx.request.headers.headersInit)
	if (!token) return false
	// console.log(ctx.request.headers.headersInit)
	const user = await User.checkAuthByToken(token, {
		include: { model: Role, required: true, as: 'roles' },
	})

	if (user instanceof Error) return false
	// console.log('-=- not user -=-', user.toJSON())
	return true
}

const resolvers = {
	Query: {
		...PartnerResolver.Query,
		...EquipmentResolver.Query,
		...UserResolver.Query,
		...WorkPlaceResolver.Query,
		...TravelLogResolver.Query,
		...AuthResolver.Query,
	},
	Mutation: {
		...PartnerResolver.Mutation,
		...EquipmentResolver.Mutation,
		...UserResolver.Mutation,
		...WorkPlaceResolver.Mutation,
		...TravelLogResolver.Mutation,
		...AuthResolver.Mutation,
	},
}

export default resolvers
