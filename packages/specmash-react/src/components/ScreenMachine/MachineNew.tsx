import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IMachine } from '../../store/machinesStore'
import { MachineForm } from './MachineForm'
import { FloatButton } from 'antd'
import { useNavigate } from 'react-router-dom'

export const MachineNew = observer(({ navigation }: any) => {
	const linkTo = useNavigate()
	const { createMachine, clearMachineData, setMachineData, types, machineData } = store.machines

	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		e.preventDefault()
		navigation.goBack()
	}
	const createMachineSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)
		const createdMachine = await createMachine(machineData)
		if (createdMachine instanceof Error) {
			console.log(createdMachine)
			setCreateError(createdMachine.message)
			setLoading(false)
			return createdMachine
		}
		clearMachineData()
		setCreateError('')
		setLoading(false)
		return linkTo(`/machines/${createdMachine.id}`)
	}
	if (loading) return <p>Loading...</p>
	return (
		<>
			<MachineForm />
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
