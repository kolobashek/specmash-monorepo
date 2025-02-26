export const users = {
	getRoles: /* GraphQL */ `
		query getRoles {
			roles {
				id
				name
			}
		}
	`,

	createUser: /* GraphQL */ `
		mutation createUser($input: CreateUserInput!) {
			createUser(input: $input) {
				id
			}
		}
	`,

	getUsers: /* GraphQL */ `
		query users($input: UsersFilterInput) {
			users(input: $input) {
				count
				rows {
					id
					phone
					name
					nickname
					comment
					roles {
						id
						name
					}
					createdAt
					updatedAt
					deletedAt
				}
			}
		}
	`,

	getUserById: /* GraphQL */ `
		query user($id: ID!) {
			user(id: $id) {
				id
				phone
				name
				nickname
				comment
				roles {
					id
					name
				}
				createdAt
				updatedAt
				deletedAt
			}
		}
	`,
	updateUser: /* GraphQL */ `
		mutation updateUser($input: UpdateUserInput!) {
			updateUser(input: $input) {
				id
				phone
				name
				nickname
				comment
				roles {
					id
					name
				}
				createdAt
				updatedAt
				deletedAt
			}
		}
	`,
}
