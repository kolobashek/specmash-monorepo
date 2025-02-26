import React from 'react' // импорт React
import store from '../../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift } from '../../../store/shiftsStore' // импорт интерфейса IShift

interface Props {
	item: IShift
}

export const ShiftItem = observer(({ item }: Props) => {
	const { id, date, shiftNumber, workPlace, equipment, driver, hoursWorked, breaks, comment } = item
	const [visible, setVisible] = React.useState(true) // состояние для видимости компонента

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
		<div key={id}>
			<p>{date || '--'}</p>
			<p>{shiftNumber || '--'}</p>
			<p>{workPlace?.name || '--'}</p>
			<p>{equipment?.name || '--'}</p>
			<p>{driver?.name || '--'}</p>
			<p>{hoursWorked || '--'}</p>
			<p>{breaks || '--'}</p>
			<p>{comment || '--'}</p>
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
// })

// const cols = [
// 	{ key: 'date', label: 'Дата' },
// 	{ key: 'shiftNumber', label: 'Смена' },
// 	{ key: 'workPlace', label: 'Объект' },
// 	{ key: 'equipment', label: 'Машина' },
// 	{ key: 'driver', label: 'Водитель' },
// 	{ key: 'hours', label: 'Часы работы' },
// 	{ key: 'breaks', label: 'Часы простоя' },
// 	{ key: 'comment', label: 'Комментарий' },
// ]
