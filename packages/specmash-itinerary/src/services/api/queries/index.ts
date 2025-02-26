import { shifts } from './shifts'
import { machines } from './machines'
import { APIError } from 'graphql-hooks'
import { users } from './users'
import { objects } from './objects'
import { contrAgents } from './contrAgents'
import { auth } from './auth'

const Queries = {
	...auth,
	...users,
	...objects,
	...contrAgents,
	...machines,
	...shifts,
}

export function handleApiError(error: APIErrors) {
	let message = ''
	if (error.fetchError) {
		// Обработка ошибки fetch
		// console.log(error.fetchError)
		message = message.concat(error.fetchError.message)
	}

	if (error.httpError) {
		// Обработка HTTP ошибки
		// console.log(error.httpError.status)
		message = message.concat(error.httpError.statusText)
	}

	if (error.graphQLErrors) {
		// Обработка ошибок GraphQL
		error.graphQLErrors.forEach((graphQLError) => {
			// console.log('handleApiError', graphQLError.message)
			message = message.concat(graphQLError.message)
		})
	}

	return message
}

export interface APIErrors extends APIError {
	graphQLErrors?: GraphQLError[]
}

interface GraphQLError {
	message: string
	locations: object[]
	path: string[]
}

export default Queries
