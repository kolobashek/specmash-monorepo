import jwt from 'jsonwebtoken'
import { createServer } from 'node:http' // Создает HTTP сервер
import { createYoga, maskError } from 'graphql-yoga' // Импорт функций из библиотеки graphql-yoga
import schema from './schema' // Импорт схемы GraphQL
import { User } from './models/user'
const signingKey = process.env.JWT_SECRET || 'secret'

const yoga = createYoga({
	// Создает инстанс GraphQL сервера
	schema, // Передает схему
	maskedErrors: {
		maskError(error, message, isDev) {
			// Функция маскировки ошибок
			console.log(error, message)
			return maskError(error, message, isDev)
		},
	},
	cors: {
		// Настройки CORS
		credentials: true,
		origin: '*',
	},
})

const server = createServer(yoga) // Создает HTTP сервер на базе инстанса GraphQL сервера

export const startServer = (port: number) => {
	// Функция запуска сервера
	server.prependListener('request', async (req, res) => {
		// Добавляет обработчик запросов
		// req - объект запроса
		// res - объект ответа

		const token = req.headers.authorization

		if (token) {
			try {
				const user = await User.checkAuthByToken(token) // проверка токена
				if (user instanceof Error) {
					console.error(user)
					return
				}
				if (user) {
					const newToken = jwt.sign({ id: user.id }, signingKey, {
						subject: user.phone,
						expiresIn: '1d',
					}) // обновление токена
					res.setHeader('Authorization', `Bearer ${newToken}`) // установка обновленного токена в ответ
				}
			} catch (error) {
				console.error(error)
			}
		}
	})

	server.listen(port, () => {
		// Запускает сервер на указанном порту
		// port - номер порта, на котором будет запущен сервер
		console.info(`Server is running on http://localhost:${port}/graphql`)
	})
}
