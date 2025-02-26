import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IMachine } from '../../store/machinesStore'
import { MachineForm } from './MachineForm'
import { useNavigate, useParams } from 'react-router-dom'
import { FloatButton } from 'antd'

export const MachineEdit = observer(({ navigation }: any) => {
	const linkTo = useNavigate()
	const {
		createMachine,
		clearMachineData,
		setMachineData,
		types,
		machineData,
		getMachineById,
		setCurrentMachine,
		updateMachine,
	} = store.machines
	const { id } = useParams()
	const machineId = Number(id)
	console.log(navigation.getState().routes)
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		e.preventDefault()
		linkTo(`/machines/${machineId}`)
	}
	const createMachineSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)
		const updatedMachine = await updateMachine({ id: machineId, ...machineData })
		if (updatedMachine instanceof Error) {
			console.log(updatedMachine)
			setCreateError(updatedMachine.message)
			setLoading(false)
			return updatedMachine
		}
		setCreateError('')
		setCurrentMachine(updatedMachine)
		setLoading(false)
		return linkTo(`/machines/${updatedMachine.id}`)
	}
	if (loading) return <p>Loading...</p>
	return (
		<>
			<MachineForm
			// machineData={machineData}
			// setMachineData={setMachineData}
			// types={types}
			// error={updateError}
			// loading={loading}
			/>
			<FloatButton
				// visible={!loading}
				onClick={createMachineSubmit}
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
