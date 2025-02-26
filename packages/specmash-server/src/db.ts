// Импорты
// import Knex from 'knex'
// import knexConfig from './config/knexfile'
// import { Model } from 'workPlaceion'
import logger from './config/logger.ts'
import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

// export const knex = Knex(knexConfig.development)

dotenv.config()
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const sequelize: Sequelize = new Sequelize(
	DB_NAME || 'specmash',
	DB_USER || 'user',
	DB_PASSWORD,
	{
		host: DB_HOST,
		port: Number(DB_PORT),
		dialect: 'mariadb',
		timezone: '+07:00',
		logging: (...msg) => {
			// logger.info(msg)
			console.log(msg)
		},
	}
)
