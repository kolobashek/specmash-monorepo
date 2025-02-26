import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from '../../utils'
import { IShift } from '../../store/shiftsStore'
import { useNavigate } from 'react-router-dom'
import { Card, Divider, FloatButton } from 'antd'

export const ShiftCard = observer(({ navigation }: any) => {
	const linkTo = useNavigate()
	const {
		currentShift,
		setCurrentShift,
		getShiftById,
		getShifts,
		updateShift,
		clearShiftData,
		setShiftData,
		shiftData,
	} = store.shifts
	const shiftId = Number(
		navigation.getState().routes.find((r) => r.name === 'ShiftDetails')?.params?.id
	)
	useEffect(() => {
		const user = async () => {
			const input = await getShiftById(shiftId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setShiftData(input)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editShiftHandler = () => {
		linkTo(`/workplaces/shifts/${shiftId}/edit`)
	}
	const editShiftSubmit = async (id: number) => {
		setLoading(true)
		const newShift = await updateShift({ id, ...shiftData })
		if (newShift instanceof Error) {
			console.log(newShift)
			setUpdateError(newShift.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentShift(newShift)
		setVisibleEditButton(true)
		setLoading(false)
		clearShiftData()
		return newShift
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setShiftInput({ isActive: !isActive })
	// }
	if (!currentShift) return <p>Что-то пошло не так.</p>
	return (
		<>
			<Card title={`${currentShift.date}, Смена №${currentShift.shiftNumber}`}>
				<Divider />
				<div>
					{/* <ListItem>
						<ListItem.Title>Водитель:</ListItem.Title>
						<ListItem.Subtitle>{`${currentShift.driver}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Машина:</ListItem.Title>
						<ListItem.Subtitle>{`${currentShift.equipment}`}</ListItem.Subtitle>
					</ListItem> */}
				</div>
			</Card>
			<FloatButton
				// visible={visibleEditButton}
				onClick={editShiftHandler}
				// placement='right'
				// icon={{ name: 'edit', color: 'white' }}
				// color='green'
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
