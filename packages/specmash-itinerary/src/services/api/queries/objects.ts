export const objects = {
	getObjects: /* GraphQL */ `
		query objects {
			objects {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,

	getObjectById: /* GraphQL */ `
		query object($id: ID!) {
			object(id: $id) {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,

	createObject: /* GraphQL */ `
		mutation createObject($input: CreateObjectInput!) {
			createObject(input: $input) {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,

	updateObject: /* GraphQL */ `
		mutation updateObject($input: UpdateObjectInput!) {
			updateObject(input: $input) {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,
}
