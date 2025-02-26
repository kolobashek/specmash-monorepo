export const workPlaces = {
	getWorkPlaces: /* GraphQL */ `
		query workPlaces {
			workPlaces {
				id
				name
				contacts
				address
				partners {
					id
					name
				}
			}
		}
	`,

	getWorkPlaceById: /* GraphQL */ `
		query workPlace($id: ID!) {
			workPlace(id: $id) {
				id
				name
				contacts
				address
				partners {
					id
					name
				}
			}
		}
	`,

	createWorkPlace: /* GraphQL */ `
		mutation createWorkPlace($input: CreateWorkPlaceInput!) {
			createWorkPlace(input: $input) {
				id
				name
				contacts
				address
				partners {
					id
					name
				}
			}
		}
	`,

	updateWorkPlace: /* GraphQL */ `
		mutation updateWorkPlace($input: UpdateWorkPlaceInput!) {
			updateWorkPlace(input: $input) {
				id
				name
				contacts
				address
				partners {
					id
					name
				}
			}
		}
	`,
}
