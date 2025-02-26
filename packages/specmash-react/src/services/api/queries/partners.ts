export const partners = {
	getPartners: /* GraphQL */ `
		query partners {
			partners {
				id
				name
				contacts
				address
				comments
				workPlaces {
					id
					name
				}
			}
		}
	`,
	getPartnerById: /* GraphQL */ `
		query partner($id: ID!) {
			partner(id: $id) {
				id
				name
				contacts
				address
				comments
				workPlaces {
					id
					name
				}
			}
		}
	`,

	createPartner: /* GraphQL */ `
		mutation createPartner($input: CreatePartnerInput!) {
			createPartner(input: $input) {
				id
				name
				contacts
				address
				comments
				workPlaces {
					id
					name
				}
			}
		}
	`,

	updatePartner: /* GraphQL */ `
		mutation updatePartner($input: UpdatePartnerInput!) {
			updatePartner(input: $input) {
				id
				name
				contacts
				address
				comments
				workPlaces {
					id
					name
				}
			}
		}
	`,
}
