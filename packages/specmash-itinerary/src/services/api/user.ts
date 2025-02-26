import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const isActive = async (userId: string, authToken: string): Promise<boolean> => {
	const config = {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	}

	const response = await axios.get(`${API_URL}/users/${userId}/is-active`, config)

	return response.data
}
