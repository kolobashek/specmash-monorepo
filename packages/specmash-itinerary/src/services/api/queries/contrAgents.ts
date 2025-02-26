export const contrAgents = {
	getContrAgents: /* GraphQL */ `
		query contrAgents {
			contrAgents {
				id
				name
				contacts
				address
				comments
				objects {
					id
					name
				}
			}
		}
	`,
	getContrAgentById: /* GraphQL */ `
		query contrAgent($id: ID!) {
			contrAgent(id: $id) {
				id
				name
				contacts
				address
				comments
				objects {
					id
					name
				}
			}
		}
	`,

	createContrAgent: /* GraphQL */ `
		mutation createContrAgent($input: CreateContrAgentInput!) {
			createContrAgent(input: $input) {
				id
				name
				contacts
				address
				comments
				objects {
					id
					name
				}
			}
		}
	`,

	updateContrAgent: /* GraphQL */ `
		mutation updateContrAgent($input: UpdateContrAgentInput!) {
			updateContrAgent(input: $input) {
				id
				name
				contacts
				address
				comments
				objects {
					id
					name
				}
			}
		}
	`,
}
