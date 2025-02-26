import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

class MachinesStore {
	auth = authStore
	machines: IMachine[] | [] = []
	machineData: IMachineDataStore = {
		type: '',
		name: '',
		dimensions: '',
		weight: '',
		licensePlate: '',
		nickname: '',
	}
	types: MachineType[] | [] = []
	currentMachine: IMachine | null = null

	constructor() {
		makeAutoObservable(this)
		this.getMachineTypes()
	}
	getMachines = async () => {
		try {
			const machines = (await graphqlRequest(Queries.getMachines)) as MachinesResponse | Error
			if (machines instanceof Error) {
				return machines
			}
			this.machines = machines.equipments
			return machines.equipments
		} catch (error) {
			return new Error(error as string)
		}
	}
	getMachineTypes = async () => {
		try {
			const types = (await graphqlRequest(Queries.getMachineTypes)) as TypesResponse | Error
			// console.log(types)
			if (types instanceof Error) {
				return types
			}
			this.types = types.getEquipmentTypes
			return types.getEquipmentTypes
		} catch (error) {
			return new Error(error as string)
		}
	}
	getMachineById = async (id: number) => {
		try {
			const machine = (await graphqlRequest(Queries.getMachineById, { id })) as
				| MachineResponse
				| Error
			if (machine instanceof Error) {
				return machine
			}
			this.currentMachine = machine.equipment
			return machine.equipment
		} catch (error) {
			return new Error(error as string)
		}
	}
	setCurrentMachine(machine: IMachine | null) {
		this.currentMachine = machine
	}
	setMachineData = ({ type, name, dimensions, weight, licensePlate, nickname }: IMachineData) => {
		this.machineData.type = type ?? this.machineData.type ?? ''
		this.machineData.name = name ?? this.machineData.name ?? ''
		this.machineData.dimensions = dimensions ?? this.machineData.dimensions ?? ''
		this.machineData.weight = weight ?? this.machineData.weight ?? ''
		this.machineData.licensePlate = licensePlate ?? this.machineData.licensePlate ?? ''
		this.machineData.nickname = nickname ?? this.machineData.nickname ?? ''
	}
	clearMachineData = () => {
		this.machineData = {
			type: this.currentMachine?.type ?? '',
			name: this.currentMachine?.name ?? '',
			dimensions: this.currentMachine?.dimensions ?? '',
			weight: this.currentMachine?.weight?.toString() ?? '',
			licensePlate: this.currentMachine?.licensePlate ?? '',
			nickname: this.currentMachine?.nickname ?? '',
		}
	}
	createMachine = async (input: IMachineData) => {
		const { weight, ...other } = input
		try {
			const response = (await graphqlRequest(Queries.createMachine, {
				input: { weight: Number(weight), ...other },
			})) as ICreateMachineResponse | Error
			if (response instanceof Error) {
				return response
			}
			return response.createEquipment
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateMachine = async (input: IMachine) => {
		const { weight, ...other } = input
		try {
			const response = (await graphqlRequest(Queries.updateMachine, {
				input: { weight: Number(weight), ...other },
			})) as UpdateMachineResponse | Error
			if (response instanceof Error) {
				return response
			}
			return response.updateEquipment
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new MachinesStore()

export interface IMachine {
	id: number
	type: string
	name: string
	dimensions?: string
	weight?: string
	licensePlate?: string
	nickname?: string
}
interface MachinesResponse {
	equipments: IMachine[]
}
interface MachineResponse {
	equipment: IMachine
}
interface ICreateMachineResponse {
	createEquipment: IMachine
}
interface UpdateMachineResponse {
	updateEquipment: IMachine
}
interface TypesResponse {
	getEquipmentTypes: MachineType[]
}
export interface MachineType {
	id: number
	name: string
}
export interface IMachineData {
	type?: string
	name?: string
	dimensions?: string
	weight?: string
	licensePlate?: string
	nickname?: string
}
interface IMachineDataStore {
	type: string
	name: string
	dimensions: string
	weight: string
	licensePlate: string
	nickname: string
}
