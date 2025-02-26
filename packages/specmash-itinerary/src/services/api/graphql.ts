import { GraphQLClient } from 'graphql-request'

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
	try {
		if (setToken) {
			setAuthTokenHeader(setToken.token)
		}
		// console.log(query, variables)
		const response = await client.request(query, variables)
		return response
	} catch (error) {
		return new Error(error as string)
	}
}
