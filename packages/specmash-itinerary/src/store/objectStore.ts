import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { IContrAgent } from './contrAgentStore'

class ObjectStore {
	list: IObject[] | [] = []
	objectData: IObjectDataStore = {
		name: '',
		contacts: '',
		address: '',
		// comment: '',
		contrAgents: [],
	}
	currentObject: IObject | null = null

	constructor() {
		makeAutoObservable(this)
		// this.getObjects()
	}
	getObjects = async () => {
		try {
			const objects = (await graphqlRequest(Queries.getObjects)) as ObjectsResponse | Error
			if (objects instanceof Error) {
				return objects
			}
			this.list = objects.objects
			return objects.objects
		} catch (error) {
			return new Error(error as string)
		}
	}
	getObjectById = async (id: number) => {
		try {
			const object = (await graphqlRequest(Queries.getObjectById, { id })) as ObjectResponse | Error
			if (object instanceof Error) {
				return object
			}
			this.currentObject = object.object
			return object.object
		} catch (error) {
			return new Error(error as string)
		}
	}
	setObjectData = ({ name, contacts, address, contrAgents }: IObjectData) => {
		name = name ?? this.objectData.name ?? ''
		contacts = contacts ?? this.objectData.contacts ?? ''
		address = address ?? this.objectData.address ?? ''
		contrAgents = contrAgents ?? this.objectData.contrAgents ?? []

		this.objectData.name = name
		this.objectData.contacts = contacts
		this.objectData.contrAgents = contrAgents
	}
	setCurrentObject(object: IObject | null) {
		this.currentObject = object
	}
	clearObjectData = () => {
		this.objectData = {
			name: '',
			contacts: '',
			address: '',
			// comment: '',
			contrAgents: [],
		}
	}
	createObject = async (objectData: IObjectData) => {
		const { contrAgents, ...payload } = objectData
		const input = { contrAgents: contrAgents?.map((agent) => Number(agent.id)) ?? [], ...payload }
		try {
			const response = (await graphqlRequest(Queries.createObject, { input })) as
				| ICreateObjectResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createObject
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateObject = async (objectData: IObject) => {
		const { contrAgents, ...payload } = objectData
		const input = { contrAgents: contrAgents?.map((agent) => Number(agent.id)) ?? [], ...payload }
		try {
			const response = (await graphqlRequest(Queries.updateObject, { input })) as
				| UpdateObjectResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.updateObject
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new ObjectStore()

export interface IObject extends IObjectData {
	id: number
	name: string
}
interface ObjectsResponse {
	objects: IObject[]
}
interface ObjectResponse {
	object: IObject
}
interface UpdateObjectResponse {
	updateObject: IObject
}
interface ICreateObjectResponse {
	createObject: IObject
}
export interface IObjectData {
	name?: string
	contacts?: string
	address?: string
	contrAgents?: IContrAgent[]
}
interface IObjectDataStore {
	name: string
	contacts: string
	address: string
	contrAgents: IContrAgent[]
}
