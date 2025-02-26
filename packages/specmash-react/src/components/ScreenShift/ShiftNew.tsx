import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IShift } from '../../store/shiftsStore'
import { ShiftForm } from './ShiftForm'
import { IPartner } from '../../store/partnerStore'
import { FloatButton } from 'antd'
import { useNavigate } from 'react-router-dom'

export const ShiftNew = observer(({ navigation }: any) => {
	const linkTo = useNavigate()
	const { createShift, clearShiftData, shiftData } = store.shifts

	const [loading, setLoading] = useState(false)
	const [createError, setCreateError] = useState('')

	const cancelHandler = () => {
		linkTo('/workplaces/shifts')
	}
	const createShiftSubmit = async () => {
		if (shiftData.date && shiftData.shiftNumber) {
			setLoading(true)
			const createdShift = await createShift()
			if (createdShift instanceof Error) {
				console.log(createdShift)
				setCreateError(createdShift.message)
				setLoading(false)
				return createdShift
			}
			// clearShiftData()
			setCreateError('')
			setLoading(false)
			return linkTo(`/workplaces/shifts/${createdShift.id}`)
		}
		setCreateError('Заполните дату и смену')
	}
	if (loading) return <p>Loading...</p>
	return (
		<>
			<ShiftForm error={createError} loading={loading} />
			<FloatButton
				// visible={!loading}
				onClick={createShiftSubmit}
				// placement='left'
				// icon={{ name: 'check', color: 'white' }}
				// color='green'
			/>
			<FloatButton
				// visible={!loading}
				onClick={cancelHandler}
				// placement='right'
				// icon={{ name: 'cancel', color: 'white' }}
				// color='red'
			/>
		</>
	)
})

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'stretch',
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
