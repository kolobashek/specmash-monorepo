import { makeAutoObservable, runInAction } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { IPartner } from './partnerStore'

class WorkPlaceStore {
	list: IWorkPlace[] | [] = []
	workPlaceData: IWorkPlaceDataStore = {
		name: '',
		contacts: '',
		address: '',
		// comment: '',
		partners: [],
	}
	currentWorkPlace: IWorkPlace | null = null

	constructor() {
		makeAutoObservable(this)
		// this.getWorkPlaces()
	}
	getWorkPlaces = async () => {
		try {
			const workPlaces = (await graphqlRequest(Queries.getWorkPlaces)) as WorkPlacesResponse | Error
			if (workPlaces instanceof Error) {
				return workPlaces
			}
			runInAction(() => {
				this.list = workPlaces.workPlaces
			})
			return workPlaces.workPlaces
		} catch (error) {
			return new Error(error as string)
		}
	}
	getWorkPlaceById = async (id: number) => {
		try {
			const workPlace = (await graphqlRequest(Queries.getWorkPlaceById, { id })) as
				| WorkPlaceResponse
				| Error
			if (workPlace instanceof Error) {
				return workPlace
			}
			runInAction(() => {
				this.currentWorkPlace = workPlace.workPlace
			})
			return workPlace.workPlace
		} catch (error) {
			return new Error(error as string)
		}
	}
	setWorkPlaceData = ({ name, contacts, address, partners }: IWorkPlaceData) => {
		name = name ?? this.workPlaceData.name ?? ''
		contacts = contacts ?? this.workPlaceData.contacts ?? ''
		address = address ?? this.workPlaceData.address ?? ''
		partners = partners ?? this.workPlaceData.partners ?? []

		this.workPlaceData.name = name
		this.workPlaceData.contacts = contacts
		this.workPlaceData.address = address
		this.workPlaceData.partners = partners
	}
	setCurrentWorkPlace(workPlace: IWorkPlace | null) {
		this.currentWorkPlace = workPlace
	}
	clearWorkPlaceData = () => {
		this.workPlaceData = {
			name: '',
			contacts: '',
			address: '',
			// comment: '',
			partners: [],
		}
	}
	createWorkPlace = async (workPlaceData: IWorkPlaceData) => {
		const { partners, ...payload } = workPlaceData
		const input = { partners: partners?.map((agent) => Number(agent.id)) ?? [], ...payload }
		try {
			const response = (await graphqlRequest(Queries.createWorkPlace, { input })) as
				| ICreateWorkPlaceResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createWorkPlace
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateWorkPlace = async (workPlaceData: IWorkPlace) => {
		const { partners, ...payload } = workPlaceData
		const input = { partners: partners?.map((agent) => Number(agent.id)) ?? [], ...payload }
		try {
			const response = (await graphqlRequest(Queries.updateWorkPlace, { input })) as
				| UpdateWorkPlaceResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.updateWorkPlace
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new WorkPlaceStore()

export interface IWorkPlace extends IWorkPlaceData {
	id: number
	name: string
}
interface WorkPlacesResponse {
	workPlaces: IWorkPlace[]
}
interface WorkPlaceResponse {
	workPlace: IWorkPlace
}
interface UpdateWorkPlaceResponse {
	updateWorkPlace: IWorkPlace
}
interface ICreateWorkPlaceResponse {
	createWorkPlace: IWorkPlace
}
export interface IWorkPlaceData {
	name?: string
	contacts?: string
	address?: string
	partners?: IPartner[]
}
interface IWorkPlaceDataStore {
	name: string
	contacts: string
	address: string
	partners: IPartner[]
}
