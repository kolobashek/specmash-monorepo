export const auth = {
	register: /* GraphQL */ `
		mutation register($input: RegisterUserInput!) {
			register(input: $input)
		}
	`,

	login: /* GraphQL */ `
		mutation Login($phone: String!, $password: String!) {
			login(phone: $phone, password: $password) {
				token
				user {
					id
					name
					nickname
					password
					phone
					roles {
						id
						name
					}
					comment
					createdAt
					updatedAt
					deletedAt
				}
			}
		}
	`,

	me: /* GraphQL */ `
		query AboutUser {
			me {
				id
				name
				nickname
				password
				phone
				roles {
					id
					name
				}
				comment
				createdAt
				updatedAt
				deletedAt
			}
		}
	`,
}
