import React, { useEffect, useState } from 'react' // импорт React
import store from '../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift, localPrkDate } from '../../store/shiftsStore' // импорт интерфейса IShift
import { IWorkPlace } from '../../store/workPlaceStore'
import { IPartner } from '../../store/partnerStore'
import { IUser } from '../../store/usersStore'
import _, { max, set } from 'lodash'
import { IMachine } from '../../store/machinesStore'
import { Card, Divider } from 'antd'

type Props = {
	shiftId?: number
	error?: string
	loading: boolean
}

export const ShiftForm = observer(({ shiftId, error, loading }: Props) => {
	// экспорт компонента ScreenShift как observer

	const {
		// деструктуризация нужных методов из store
		shiftData,
		setShiftData,
		getShiftById,
	} = store.shifts
	const [date, setDate] = useState(Date.now() - (Date.now() % 86400000)) // состояние для даты
	const [allPartners, setAllPartners] = useState([] as IPartner[])
	const [filteredPartners, setFilteredPartners] = useState(allPartners)
	const [allWorkPlaces, setAllWorkPlaces] = useState([] as IWorkPlace[])
	const [filteredWorkPlaces, setFilteredWorkPlaces] = useState(allWorkPlaces)
	const [allDrivers, setAllDrivers] = useState([] as IUser[])
	const [filteredDrivers, setFilteredDrivers] = useState(allDrivers)
	const [allMachines, setAllMachines] = useState([] as IMachine[])
	const [filteredMachines, setFilteredMachines] = useState(allMachines)
	const [dateBuffer, setDateBuffer] = useState(localPrkDate.msToDateString(_.now()))
	useEffect(() => {
		const start = async () => {
			try {
				const cAFromApi = await store.partners.getPartners()
				const workPlacesFromApi = await store.workPlaces.getWorkPlaces()
				const driversFromApi = await store.users.getUsers({ roles: [3] })
				const machinesFromApi = await store.machines.getMachines()
				if (!(cAFromApi instanceof Error)) {
					setAllPartners(cAFromApi)
					setFilteredPartners(cAFromApi)
				}
				if (!(workPlacesFromApi instanceof Error)) {
					setAllWorkPlaces(workPlacesFromApi)
					setFilteredWorkPlaces(workPlacesFromApi)
				}
				if (!(machinesFromApi instanceof Error)) {
					setAllMachines(machinesFromApi)
					setFilteredMachines(machinesFromApi)
				}
				if (!(driversFromApi instanceof Error)) {
					setAllDrivers(driversFromApi.rows)
					setFilteredDrivers(driversFromApi.rows)
				}
				if (!shiftData.date) {
					inputChange({ date: localPrkDate.msToDateString(date) })
					setDateBuffer(localPrkDate.msToDateString(date))
				}
				if (shiftId) {
					const initialData = await getShiftById(shiftId)
					if (!(initialData instanceof Error)) {
						setShiftData(initialData)
					}
				}
			} catch (error) {
				console.log(error)
			}
		}
		start()
	}, [])
	useEffect(() => {
		const typedId = shiftData.partner
		if (typedId) {
			const fWorkPlaces = _.filter(allWorkPlaces, (obj) => {
				return _.some(obj.partners, (agent) => {
					return agent.id === typedId.id
				})
			})
			setFilteredWorkPlaces(fWorkPlaces)
		}
		setFilteredWorkPlaces(allWorkPlaces)
	}, [shiftData.partner])
	useEffect(() => {
		const typedId = shiftData.workPlace
		if (typedId) {
			const fPartners = _.filter(allPartners, (driver) => {
				return _.some(driver.workPlaces, (obj) => {
					return obj.id === typedId.id
				})
			})
			setFilteredPartners(fPartners)
		}
		setFilteredPartners(allPartners)
	}, [shiftData.workPlace])

	const inputChange = (input: Partial<IShift>) => {
		setShiftData({
			...shiftData,
			...input,
		})
	}
	const onDateChange = (event: any, selectedDate?: Date) => {
		if (selectedDate) {
			const currentDate = localPrkDate.dateToMs(selectedDate)
			setDate(currentDate)
			inputChange({ date: localPrkDate.msToDateString(currentDate) })
		}
	}

	const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/
	const handleDateChange = (date: string) => {
		if (!date) return ''
		const parts = date.split('.')
		_.slice(parts, 0, 3)
		const cleaned = parts.map((str2, key) => {
			const maxLength = key === (0 || 1) ? 2 : 4
			str2.replace(/[^\d]/g, '').slice(0, maxLength)
			const str1 = dateBuffer.split('.')[key]
			let result = ''
			if (str2.length > maxLength) {
				for (let i = 0; i < str1.length; i++) {
					if (str1[i] !== str2[i] && str1[i] === str2[i + 1]) {
						result += str2[i]
					} else {
						result += str1[i]
					}
				}
			} else result = str2
			const max = key === 0 ? 31 : key === 1 ? 12 : 2050
			if (Number(result) > max) result = str1
			return result
		})
		// Обновляем значение
		setDateBuffer(cleaned.join('.'))
		if (cleaned[0].length > 0 && cleaned[1].length > 0 && cleaned[2].length === 4) {
			inputChange({ date: cleaned.join('.') })
		}
	}
	const dateValidate = () => {
		if (dateRegex.test(dateBuffer)) {
			inputChange({ date: dateBuffer })
		} else {
			alert('Дата введена неверно')
		}
	}

	// Отрисовка компонента
	return (
		<div>
			<Card
				title={
					(shiftData.equipment ? shiftData.equipment.name + ', ' : '') +
					shiftData.date +
					(shiftData.shiftNumber ? ', смена №' + shiftData.shiftNumber : '')
				}
			>
				<Divider />
				<div>
					{/* <ListItem>
						<ListItem.Content>
							{device === 'PHONE' ? (
								<Button
									onPress={showDatepicker}
									title={
										localPrkDate.msToDate(date).getDate() +
										'.' +
										(localPrkDate.msToDate(date).getMonth() + 1) +
										'.' +
										localPrkDate.msToDate(date).getFullYear()
									}
								/>
							) : (
								<pInput
									value={dateBuffer}
									onChangeText={handleDateChange}
									onEndEditing={dateValidate}
									style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10 }}
								/>
							)}
							<ListItem.Subtitle>
								<p>
									selected:{' '}
									{shiftData.date
										? localPrkDate.stringToDate(shiftData.date).toLocaleString()
										: 'не выбрано'}
								</p>
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title>Смена:</ListItem.Title>
							<ListItem.Subtitle>
								<ListItem.CheckBox
									checked={shiftData.shiftNumber === 1}
									onPress={() => inputChange({ shiftNumber: 1 })}
									checkedIcon='dot-circle-o'
									uncheckedIcon='circle-o'
									title='1-я - 08:00'
								/>
								<ListItem.CheckBox
									checked={shiftData.shiftNumber === 2}
									onPress={() => inputChange({ shiftNumber: 2 })}
									checkedIcon='dot-circle-o'
									uncheckedIcon='circle-o'
									title='2-я - 20:00'
								/>
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
					<ListItem>
						<ListItem.Title>Контрагент:</ListItem.Title>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={filteredPartners}
							search
							searchField='name'
							maxHeight={300}
							labelField={'name'}
							valueField={'id'}
							placeholder={shiftData.partner?.name || 'Выберите контрагента'}
							searchPlaceholder='Найти...'
							value={shiftData.partner}
							onChange={(e) => inputChange({ partner: e })}
							renderLeftIcon={() => {
								return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
							}}
							renderItem={(item) => {
								return (
									<div style={styles.item}>
										<p style={styles.textItem}>{item.name}</p>
										{item.id === shiftData.partner?.id && (
											<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
										)}
									</div>
								)
							}}
							disable={loading}
						/>
					</ListItem>
					<ListItem>
						<ListItem.Title>Объект:</ListItem.Title>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={filteredWorkPlaces}
							search
							searchField='name'
							maxHeight={300}
							labelField={'name'}
							valueField={'id'}
							placeholder={shiftData.workPlace?.name || 'Выберите объект'}
							searchPlaceholder='Найти...'
							value={shiftData.workPlace}
							onChange={(e) => inputChange({ workPlace: e })}
							renderLeftIcon={() => {
								return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
							}}
							renderItem={(item) => {
								return (
									<div style={styles.item}>
										<p style={styles.textItem}>{item.name}</p>
										{item.id === shiftData.workPlace?.id && (
											<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
										)}
									</div>
								)
							}}
							disable={loading}
						/>
					</ListItem>
					<ListItem>
						<ListItem.Title>Техника:</ListItem.Title>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={allMachines}
							search
							searchField='name'
							maxHeight={300}
							labelField={'name'}
							valueField={'id'}
							placeholder={shiftData.equipment?.name || 'Выберите технику'}
							searchPlaceholder='Найти...'
							value={shiftData.equipment}
							onChange={(e) => inputChange({ equipment: e })}
							renderLeftIcon={() => {
								return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
							}}
							renderItem={(item) => {
								return (
									<div style={styles.item}>
										<p style={styles.textItem}>{item.name}</p>
										{item.id === shiftData.equipment?.id && (
											<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
										)}
									</div>
								)
							}}
							disable={loading}
						/>
					</ListItem>
					<ListItem>
						<ListItem.Title>Водитель:</ListItem.Title>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={allDrivers}
							search
							searchField='name'
							maxHeight={300}
							labelField={'name'}
							valueField={'id'}
							placeholder={shiftData.driver?.name || 'Выберите водителя'}
							searchPlaceholder='Найти...'
							value={shiftData.driver}
							onChange={(e) => inputChange({ driver: e })}
							renderLeftIcon={() => {
								return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
							}}
							renderItem={(item) => {
								return (
									<div style={styles.item}>
										<p style={styles.textItem}>{item.name}</p>
										{item.id === shiftData.driver?.id && (
											<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
										)}
									</div>
								)
							}}
							disable={loading}
						/>
					</ListItem>
					<ListItem>
						<ListItem.Title>Комментарий:</ListItem.Title>
						<ListItem.Input
							placeholder={shiftData.comments || 'Комментарий'}
							value={shiftData.comments}
							onChangeText={(e) => inputChange({ comments: e })}
							disabled={loading}
							style={{ textAlign: 'left' }}
						/>
					</ListItem> */}
				</div>
				{error && (
					<>
						<Divider />
						<p style={{ color: 'red' }}>{error}</p>
					</>
				)}
			</Card>
		</div>
	)
})

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	title: {
// 		fontSize: 20,
// 		textAlign: 'center',
// 		marginVertical: 20,
// 	},
// 	table: {
// 		flex: 1,
// 		paddingHorizontal: 16, // добавили горизонтальный padding
// 	},
// 	row: {
// 		flexDirection: 'row',
// 		borderBottomWidth: 1,
// 		borderColor: '#ddd',
// 	},
// 	header: {
// 		flexDirection: 'row',
// 		borderBottomWidth: 2, // увеличили толщину линии для заголовка
// 	},
// 	cell: {
// 		flex: 1,
// 		padding: 10,
// 		textAlign: 'center', // выравнивание по центру
// 	},
// 	cellHeader: {
// 		flex: 1,
// 		padding: 10,
// 		fontWeight: 'bold', // жирный шрифт
// 		textAlign: 'center',
// 	},
// 	dropdown: {
// 		margin: 16,
// 		height: 50,
// 		backgroundColor: 'white',
// 		borderRadius: 12,
// 		padding: 12,
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.2,
// 		shadowRadius: 1.41,

// 		elevation: 2,
// 	},
// 	icon: {
// 		marginRight: 5,
// 	},
// 	item: {
// 		padding: 17,
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 	},
// 	textItem: {
// 		flex: 1,
// 		fontSize: 16,
// 	},
// 	placeholderStyle: {
// 		fontSize: 16,
// 	},
// 	selectedTextStyle: {
// 		fontSize: 16,
// 	},
// 	iconStyle: {
// 		width: 20,
// 		height: 20,
// 	},
// 	inputSearchStyle: {
// 		height: 40,
// 		fontSize: 16,
// 	},
// })
