import React, { useEffect, useState } from 'react' // импорт React
import { StyleSheet, View, Text, ScrollView } from 'react-native' // импорт компонентов из React Native
import { FAB, Input, BottomSheet, Button, ListItem, Card } from '@rneui/themed' // импорт FAB компонента
import DateTimePicker from '@react-native-community/datetimepicker' // импорт компонента DateTimePicker
import store from '../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift } from '../../store/shiftsStore' // импорт интерфейса IShift
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IObjectData } from '../../store/objectStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ObjectStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { MultiSelect } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { IObject } from '../../store/objectStore'
import { IContrAgent } from '../../store/contrAgentStore'

export const ShiftsFilter = observer(() => {
	// экспорт компонента TableScreen как observer

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
		<View style={styles.container}>
			<Text>Filter is here</Text>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},

	filterSection: {
		marginBottom: 16,
	},
})
