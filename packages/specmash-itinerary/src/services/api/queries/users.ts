export const users = {
	isActive: /* GraphQL */ `
		query isActive($userId: ID!) {
			isActive(userId: $userId)
		}
	`,

	getRoles: /* GraphQL */ `
		query getRoles {
			roles {
				id
				name
			}
		}
	`,

	createUser: /* GraphQL */ `
		mutation CreateUser(
			$phone: String!
			$name: String!
			$nickname: String
			$comment: String
			$roles: [Int]
			$isActive: String
		) {
			createEquipment(
				phone: $phone
				name: $name
				nickname: $nickname
				comment: $comment
				isActive: $isActive
				roles: $roles
			) {
				id
				password
			}
		}
	`,

	getUsers: /* GraphQL */ `
		query users($input: UsersFilterInput) {
			users(input: $input) {
				id
				phone
				name
				nickname
				comment
				roles {
					id
					name
				}
				isActive
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
				isActive
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
				isActive
			}
		}
	`,
}
