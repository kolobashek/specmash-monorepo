import React, { useEffect, useState } from 'react' // импорт React
import store from '../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift } from '../../store/shiftsStore' // импорт интерфейса IShift

import { localizedRoleName } from '../../utils'
import { IWorkPlaceData } from '../../store/workPlaceStore'
import { IWorkPlace } from '../../store/workPlaceStore'
import { IPartner } from '../../store/partnerStore'

export const ShiftsFilter = observer(() => {
	// экспорт компонента ScreenShift как observer

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

	// Функция для переключения отображения только заполненных или всех смен
	const showSchedule = () => {
		// Переключаем фильтр только заполненных смен
		// setShiftsFilterOnlyFull(!shiftsTableFilter.onlyFull)
		// Если ранее были только заполненные смены, убираем пустые
		if (shiftsTableFilter.onlyFull) {
			removeEmptyShifts()
		} else {
			// Иначе добавляем обратно пустые смены
			addEmptyShifts()
		}
	}
	return (
		<div>
			<p>Filter is here</p>
		</div>
	)
})

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 16,
// 	},

// 	filterSection: {
// 		marginBottom: 16,
// 	},
// })
