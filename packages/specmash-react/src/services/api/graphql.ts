import { GraphQLClient } from 'graphql-request'
import { GraphQLError, GraphQLResponse } from 'graphql-request/build/esm/types'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = API_URL + '/graphql'

const client = new GraphQLClient(url)
export const setAuthTokenHeader = (token: string) => {
	client.setHeader('Authorization', `Bearer ${token}`)
}

export const graphqlRequest = async (
	query: string,
	variables?: any,
	setToken?: { token: string }
) => {
	const token = window.localStorage.getItem('token')
	try {
		if (setToken) {
			setAuthTokenHeader(setToken.token)
		} else if (token) setAuthTokenHeader(token)
		// console.log(query, variables)
		const response = await client.request(query, variables)
		return response
	} catch (error: any) {
		let string = error.toString()
		const index = string.indexOf('{')
		if (index !== -1) {
			string = string.substring(index)
		}
		console.log(JSON.parse(string))
		const graphQLError = JSON.parse(string).response.errors as GraphQLError[]
		const errorMessage = graphQLError.map((err) => `${err.message}`).join('\n')
		if (errorMessage.includes('jwt expired')) {
			window.localStorage.removeItem('token')
			return new Error('Токен просрочен')
		} else if (errorMessage.includes('jwt malformed')) {
			window.localStorage.removeItem('token')
			return new Error('Токен невалидный')
		}
		return new Error(errorMessage)
	}
}
