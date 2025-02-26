import { shifts } from './shifts'
import { machines } from './machines'
// import { APIError } from 'graphql-hooks'
import { users } from './users'
import { workPlaces } from './workPlaces'
import { partners } from './partners'
import { auth } from './auth'

const Queries = {
	...auth,
	...users,
	...workPlaces,
	...partners,
	...machines,
	...shifts,
}

export function handleApiError(error: any) {
	let message = ''
	// if (error.fetchError) {
	// 	// Обработка ошибки fetch
	// 	// console.log(error.fetchError)
	// 	message = message.concat(error.fetchError.message)
	// }

	// if (error.httpError) {
	// 	// Обработка HTTP ошибки
	// 	// console.log(error.httpError.status)
	// 	message = message.concat(error.httpError.statusText)
	// }

	if (error.graphQLErrors) {
		// Обработка ошибок GraphQL
		error.graphQLErrors.forEach((graphQLError: any) => {
			// console.log('handleApiError', graphQLError.message)
			message = message.concat(graphQLError.message)
		})
	}

	return message
}

// export interface APIErrors extends APIError {
// 	graphQLErrors?: GraphQLError[]
// }

interface GraphQLError {
	message: string
	locations: object[]
	path: string[]
}

export default Queries
