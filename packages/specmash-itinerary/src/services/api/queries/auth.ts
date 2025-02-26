export const auth = {
	register: /* GraphQL */ `
		mutation createUser($input: CreateUserInput!) {
			createUser(input: $input)
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
					isActive
					comment
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
				isActive
				comment
			}
		}
	`,
}
