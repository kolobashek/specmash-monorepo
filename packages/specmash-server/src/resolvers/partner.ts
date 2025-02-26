import { resolverPermissions } from '.'
import { Partner, PartnerAttributes, PartnerAttributesInput } from '../models/partner'
import { GraphQLError } from 'graphql'
import { WorkPlace } from '../models/workPlace'

/**
 * Partner resolver defines GraphQL queries and mutations for partners.
 *
 * Exports an object with Query and Mutation fields.
 *
 * Query:
 * - partners: Gets all partners.
 * - partner: Gets a partner by ID.
 *
 * Mutation:
 * - createPartner: Creates a new partner.
 * - updatePartner: Updates an existing partner by ID.
 *
 * Uses sequelize models to query database.
 * Checks user permissions before mutating data.
 */
export const PartnerResolver = {
	Query: {
		partners: async () => {
			// получить объекты из БД
			const partners = await Partner.findAll({ include: [{ model: WorkPlace, as: 'workPlaces' }] })
			return partners
		},

		partner: async (parent: any, { id }: { id: number }, ctx: any) => {
			// получить объекты из БД
			const partners = await Partner.findByPk(id, {
				include: [{ model: WorkPlace, as: 'workPlaces' }],
			})
			return partners
		},
	},
	Mutation: {
		createPartner: async (parent: any, { input }: { input: PartnerAttributesInput }, ctx: any) => {
			// console.log('===createCAresolver', ctx)
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				// if (!input.workPlaces?.length)
				// console.log('---===--->')
				// console.log(input)
				// console.log('<---===---')
				const partner = await Partner.create(
					{ ...input },
					{ include: [{ model: WorkPlace, as: 'workPlaces' }] }
				)
				// console.log('---===--->')
				// console.log(partner)
				// console.log('<---===---')
				return partner
			}
			return new GraphQLError('Недостаточно прав')
		},
		updatePartner: async (parent: any, { input }: { input: PartnerAttributes }, ctx: any) => {
			const userHasPermissions = await resolverPermissions(ctx, 'admin', 'manager')
			if (userHasPermissions) {
				const user = await Partner.findByPk(input.id)
				if (user) {
					await user.update({ ...input })
				}
				console.log(user)
				return user
			}
			return new GraphQLError('Недостаточно прав')
		},
	},
}
