import { startServer } from './src/app'
import { sequelize } from './src/db'
import { EquipmentType } from './src/models/equipmentType'
import { Role } from './src/models/role'
import { User } from './src/models/user'

const port = Number(process.env.SERVER_PORT) || 3000

const testDB = async () => {
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.')
		await sequelize.sync({ alter: true })
		// await sequelize.sync({ force: true })
		await User.createDefaults()
		await EquipmentType.createDefaults()
		console.log('Database synced successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}
testDB()
startServer(port)
