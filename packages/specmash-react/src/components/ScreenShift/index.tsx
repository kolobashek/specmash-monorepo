import React from 'react' // импорт React
import store from '../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift } from '../../store/shiftsStore' // импорт интерфейса IShift
import { ShiftForm } from './ShiftForm'
import { ShiftsList } from './ShiftsList'
import { useNavigate } from 'react-router-dom'
import { FloatButton } from 'antd'

export const ScreenShift = observer(({ navigation }: any) => {
	// экспорт компонента ScreenShift как observer
	const linkTo = useNavigate()

	const {
		// деструктуризация нужных методов из store
		setShiftsTableSortBy,
		shifts,
		getShiftsFromApi,
		// setShiftsFilterOnlyFull,
		shiftsTableFilter,
		addEmptyShifts,
		removeEmptyShifts,
	} = store.shifts

	// Отрисовка компонента
	return (
		<>
			{/* Компонент для горизонтальной прокрутки списка смен */}
			<div>
				<div>
					<ShiftsList />
					{/* Кнопка фильтров */}
					{/* <FloatButton
						visible={shiftsTableFilter.onlyFull}
						onPress={showSchedule}
						placement='left'
						title='Показать все'
						icon={{ name: 'visibility', color: 'white' }}
						color='grey'
					/> */}
				</div>
			</div>
			<FloatButton
				// visible={true}
				onClick={() => linkTo('/shifts/new')}
				// placement='right'
				// icon={{ name: 'add', color: 'white' }}
				// color='green'
			/>
		</>
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
// })

const cols = [
	{ key: 'date', label: 'Дата' },
	{ key: 'shiftNumber', label: 'Смена' },
	{ key: 'workPlace', label: 'Объект' },
	{ key: 'equipment', label: 'Машина' },
	{ key: 'driver', label: 'Водитель' },
	{ key: 'hours', label: 'Часы работы' },
	{ key: 'breaks', label: 'Часы простоя' },
	{ key: 'comment', label: 'Комментарий' },
]
