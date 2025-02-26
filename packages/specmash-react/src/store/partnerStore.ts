import { makeAutoObservable, runInAction } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { IWorkPlace } from './workPlaceStore'

class PartnerStore {
	list: IPartner[] | [] = []
	partnerData: IPartnerDataStore = {
		name: '',
		contacts: '',
		address: '',
		comments: '',
		workPlaces: [],
	}
	// currentPartner: IPartner | null = null

	constructor() {
		makeAutoObservable(this)
	}
	getPartners = async () => {
		try {
			const partners = (await graphqlRequest(Queries.getPartners)) as PartnersResponse | Error
			if (partners instanceof Error) {
				return partners
			}
			runInAction(() => {
				this.list = partners.partners
			})
			return partners.partners
		} catch (error) {
			return new Error(error as string)
		}
	}
	getPartnerById = async (id: number) => {
		try {
			const partner = (await graphqlRequest(Queries.getPartnerById, { id })) as
				| PartnerResponse
				| Error
			if (partner instanceof Error) {
				return partner
			}
			// this.currentPartner = partner.partner
			return partner.partner
		} catch (error) {
			return new Error(error as string)
		}
	}
	setPartnerData = ({
		name = this.partnerData.name,
		contacts,
		address,
		comments,
		workPlaces,
	}: IPartnerData) => {
		// console.log(comments)
		name = name ?? this.partnerData.name ?? ''
		contacts = contacts ?? this.partnerData.contacts ?? ''
		address = address ?? this.partnerData.address ?? ''
		comments = comments ?? this.partnerData.comments ?? ''
		workPlaces = workPlaces ?? this.partnerData.workPlaces ?? false

		this.partnerData.name = name
		this.partnerData.contacts = contacts
		this.partnerData.address = address
		this.partnerData.comments = comments
		this.partnerData.workPlaces = workPlaces
	}
	// setCurrentPartner(partner: IPartner | null) {
	// 	this.currentPartner = partner
	// }
	clearPartnerData = () => {
		this.partnerData = {
			name: '',
			contacts: '',
			address: '',
			comments: '',
			workPlaces: [],
		}
	}
	createPartner = async (input: IPartnerData) => {
		try {
			const response = (await graphqlRequest(Queries.createPartner, { input })) as
				| ICreatePartnerResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createPartner
		} catch (error) {
			return new Error(error as string)
		}
	}
	updatePartner = async (input: IPartner) => {
		try {
			const response = (await graphqlRequest(Queries.updateUser, { input })) as
				| UpdatePartnerResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.updateUser
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new PartnerStore()

export interface IPartner {
	id: number
	name: string
	contacts?: string
	address?: string
	comments?: string
	workPlaces?: IWorkPlace[]
}
interface PartnersResponse {
	partners: IPartner[]
}
interface PartnerResponse {
	partner: IPartner
}
interface UpdatePartnerResponse {
	updateUser: IPartner
}
interface ICreatePartnerResponse {
	createPartner: IPartner
}
// interface WorkPlacesResponse {
// 	workPlaces: IWorkPlace[]
// }
export interface IPartnerData {
	name?: string
	contacts?: string
	address?: string
	comments?: string
	workPlaces?: IWorkPlace[]
}
interface IPartnerDataStore {
	name: string
	contacts: string
	address: string
	comments: string
	workPlaces: IWorkPlace[]
}
