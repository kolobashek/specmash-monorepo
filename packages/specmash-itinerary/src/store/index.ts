import { makeAutoObservable } from 'mobx'
import authStore from './authStore'
import shiftsStore from './shiftsStore'
import machinesStore from './machinesStore'
import usersStore from './usersStore'
import contrAgentStore from './contrAgentStore'
import objectStore from './objectStore'

class Store {
	auth = authStore
	shifts = shiftsStore
	machines = machinesStore
	users = usersStore
	contrAgents = contrAgentStore
	objects = objectStore

	constructor() {
		makeAutoObservable(this)
	}
}

export default new Store()
