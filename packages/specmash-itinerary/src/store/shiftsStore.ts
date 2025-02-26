import { objects } from './../services/api/queries/objects'
import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import _ from 'lodash'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

class ShiftsStore {
	auth = authStore
	shiftsTableFilter = {
		dateStart: localPrkDate.dateToString(new Date()),
		dateEnd: localPrkDate.dateToString(new Date(Date.now() + 3 * (24 * 60 * 60 * 1000))),
		shiftNumber: null, // фильтр по номеру смены
		objects: [], // фильтр по объектам
		equipments: [], // фильтр по оборудованию
		drivers: [], // фильтр по водителям
		hours: '', // должно быть три вида фильтра: заполнено, не заполнено, не имеет значения
		breaks: '', // аналогично hours
		comments: '', // аналогично hours
		contrAgents: '', // фильтр по контрагентам
		deleted: '', // фильтр по удаленным записям
		hoursWorkedStart: '', // фильтр по количеству отработанных часов 'От'
		hoursWorkedEnd: '', // фильтр по количеству отработанных часов 'До'
		sortBy: '', // имя поля для сортировки
		sortDirection: '', // ASC or DESC
		page: '', // текущая страница
		limit: '', // количество элементов на странице
		onlyFull: [], // показывать только заполненные смены
		onlyEmpty: [], // показывать только незаполненные смены
	}
	currentShift = {} as IShift
	shiftsTableSortBy = 'date'
	shifts: IShift[] = []
	shiftData: Partial<IShift> = {}

	constructor() {
		makeAutoObservable(this)
	}
	createShift = async () => {
		const { contrAgent, object, driver, equipment, shiftNumber, ...shiftData } = this.shiftData
		const payload = {
			...shiftData,
			contrAgent: Number(contrAgent?.id),
			object: Number(object?.id),
			driver: Number(driver?.id),
			equipment: Number(equipment?.id),
			shiftNumber: Number(shiftNumber),
		}
		try {
			const response = (await graphqlRequest(Queries.createShift, {
				input: payload,
			})) as CreateShiftResponse
			if (response.createShift) {
				this.shifts.push(response.createShift)
				return response.createShift
			}
			return response.createShift
		} catch (error) {
			console.error(error)
			return new Error('Что-то пошло не так')
		}
	}
	setShiftsTableSortBy(sortBy: string) {
		switch (sortBy) {
			case 'date':
				this.shifts.sort((a, b) => {
					if (
						localPrkDate.stringToDate(a.date).getTime() <
						localPrkDate.stringToDate(b.date).getTime()
					)
						return -1
					if (
						localPrkDate.stringToDate(a.date).getTime() >
						localPrkDate.stringToDate(b.date).getTime()
					)
						return 1
					return 0
				})
				break
			case 'driver':
				this.shifts.sort((a, b) => {
					if (!a.driver) return -1
					if (!b.driver) return 1
					if (a.driver < b.driver) return -1
					if (a.driver > b.driver) return 1
					return 0
				})
				break

			default:
				break
		}
	}
	// setShiftsFilterOnlyFull(onlyFull: boolean) {
	// 	console.log(this)
	// 	this.shiftsTableFilter.onlyFull = onlyFull
	// }

	addEmptyShifts = () => {
		// Получаем даты начала и конца
		const { dateStart } = this.shiftsTableFilter
		const { dateEnd } = this.shiftsTableFilter

		// Проходим по датам от начала до конца
		let currentDate = localPrkDate.stringToDate(dateStart)
		while (currentDate != localPrkDate.stringToDate(dateEnd)) {
			// Проверяем, есть ли уже смены на эту дату
			const shiftsForDate = this.shifts.filter(
				(s) => localPrkDate.stringToDate(s.date) === currentDate
			)

			// Если смен меньше 2 - добавляем недостающие
			if (shiftsForDate.length < 2) {
				const numToAdd = 2 - shiftsForDate.length
				for (let i = 0; i < numToAdd; i++) {
					this.shifts.push({
						id: this.shifts.length + 1,
						date: localPrkDate.dateToString(currentDate),
						shiftNumber: numToAdd,
						object: undefined,
						equipment: undefined,
						driver: undefined,
						hours: 0,
						breaks: 0,
						comment: '',
					})
				}
			}

			// Переходим к следующей дате
			currentDate = localPrkDate.addDays(currentDate, 1)
		}
	}
	removeEmptyShifts = () => {
		// Фильтруем смены, у которых все поля пустые
		this.shifts = this.shifts.filter((shift) => {
			return (
				shift.object ||
				shift.equipment ||
				shift.driver ||
				shift.hours ||
				shift.breaks ||
				shift.comment
			)
		})
	}
	updateShift = async (data: Partial<IShift>) => {
		try {
			const shiftIndex = this.shifts.findIndex((s) => s.id === data.id)
			if (shiftIndex !== -1) {
				this.shifts[shiftIndex] = { ...this.shifts[shiftIndex], ...data }
				const response = (await graphqlRequest(Queries.updateShift, {
					input: data,
				})) as UpdateShiftResponse
				this.shifts[shiftIndex] = response.updateShift
				return response.updateShift
			}
			return new Error('Что-то пошло не так')
		} catch (error) {
			console.error(error)
			return new Error('Что-то пошло не так')
		}
	}

	removeShift = (id: number) => {
		this.shifts = this.shifts.filter((shift) => shift.id !== id)
	}

	getShifts = async () => {
		try {
			const response = (await graphqlRequest(Queries.getShifts, {
				dateStart: this.shiftsTableFilter.dateStart,
				dateEnd: this.shiftsTableFilter.dateEnd,
			})) as IShiftsResponse | Error
			if (response instanceof Error) {
				console.error(response)
			} else this.shifts = response.travelLogs
		} catch (error) {
			console.log(error)
		}
	}

	getShiftsFromApi = async () => {
		try {
			const res = (await graphqlRequest(Queries.getShifts, this.shiftsTableFilter, {
				token: this.auth.token,
			})) as IShiftsResponse | Error
			if (res instanceof Error) {
				console.error(res)
			} else this.shifts = res.travelLogs
		} catch (error) {
			return new Error(error as string)
		}
	}
	setShiftData = async (shift: Partial<IShift>) => {
		_.assign(this.shiftData, shift)
		// Object.entries(shift).forEach(([key, value]) => {
		// 	this.shiftData[key as keyof IShift] = value as IShift[typeof key]
		// })
	}
	setCurrentShift = (shift: Partial<IShift>) => {
		_.assign(this.currentShift, shift)
	}
	clearShiftData = () => {
		this.shiftData = {}
	}
	getShiftById = async (id: number) => {
		try {
			const shift = (await graphqlRequest(Queries.getShiftById, { id: id })) as IShiftResponse
			return shift.travelLog
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export const localPrkDate = {
	stringToDate: (dateString: string) => {
		const [day, month, year] = dateString.split('.')
		return new Date(Number(year), Number(month) - 1, Number(day))
	},
	dateToString: (date: Date) => {
		return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
	},
	addDays: (date: Date, days: number) => {
		date.setDate(date.getDate() + days)
		return date
	},
	msToDate: (milliseconds: number) => {
		return new Date(milliseconds)
	},
	msToString: (milliseconds: number) => {
		return localPrkDate.dateToString(localPrkDate.msToDate(milliseconds))
	},
	dateToMs: (date: Date) => {
		return date.getTime()
	},
	msToDateString: (milliseconds: number) => {
		return localPrkDate.dateToString(new Date(milliseconds))
	},
	dateStringToMs: (dateString: string) => {
		const date = localPrkDate.stringToDate(dateString)
		return date.getTime()
	},
}

export default new ShiftsStore()

export interface IShift {
	id: number
	date: string
	shiftNumber: number
	object?: innerChildren
	contrAgent?: innerChildren
	equipment?: innerChildren
	driver?: innerChildren
	hours?: number
	breaks?: number
	comments?: string

	[key: string]: string | number | undefined | innerChildren
}

interface IShiftsResponse {
	travelLogs: IShift[]
}
interface CreateShiftResponse {
	createShift: IShift
}
interface IShiftResponse {
	travelLog: IShift
}
interface UpdateShiftResponse {
	updateShift: IShift
}
interface innerChildren {
	id: number
	name: string
}
