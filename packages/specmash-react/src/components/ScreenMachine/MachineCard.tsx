import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from 'utils'
import { MachineForm } from './MachineForm'
import { useNavigate, useParams } from 'react-router-dom'
import { PDFViewer } from '@react-pdf/renderer'
import { Button, Card, Divider, FloatButton, List, Typography, Modal } from 'antd'
import Title from 'antd/es/typography/Title'
import store from 'store'
import { IMachine } from 'store/machinesStore'
import { PrintForm } from './PrintForm'

export const MachineCard = observer(() => {
	const {
		currentMachine,
		setCurrentMachine,
		getMachineById,
		getMachines,
		updateMachine,
		clearMachineData,
		setMachineData,
		types,
		machineData,
	} = store.machines
	const linkTo = useNavigate()
	const { id } = useParams()
	const machineId = Number(id)
	useEffect(() => {
		const machine = async () => {
			setLoading(true)
			const input = await getMachineById(machineId)
			if (input instanceof Error) {
				setLoading(false)
				return new Error('Unable to fetch machine')
			}
			setMachineData(input)
			setCurrentMachine(input)
			setLoading(false)
		}
		machine()
	}, [])

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editMachineHandler = () => {
		linkTo(`/machines/${machineId}/edit`)
		// setVisibleEditButton(!visibleEditButton)
	}
	const editMachineSubmit = async (id: number) => {
		setLoading(true)
		const updatedMachine = await updateMachine({ id, ...machineData })
		if (updatedMachine instanceof Error) {
			console.log(updatedMachine)
			setUpdateError(updatedMachine.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentMachine(updatedMachine)
		setVisibleEditButton(true)
		setLoading(false)
		// clearMachineData()
		return updatedMachine
	}
	const printHandler = () => {
		// print logic
		console.log('Printing machine details...')
		setIsModalOpen(true)
	}
	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setMachineData({ isActive: !isActive })
	// }
	if (loading) return <p>Loading...</p>
	if (!currentMachine) return <p>Что-то пошло не так.</p>
	// if (!visibleEditButton) return <MachineForm id={currentMachine.id} />
	const { name, nickname, type, weight, licensePlate } = currentMachine
	return (
		<>
			<Card>
				<Title>{`${name}` + (nickname ? `, ${nickname}` : '')}</Title>
				<Button loading={loading} onClick={printHandler}>
					Печать
				</Button>
				<Divider />
				<div>
					<List.Item>
						<Title>Вес, кг:</Title>
						<Typography.Text>{`${weight ? weight : ''}`}</Typography.Text>
					</List.Item>
					<List.Item>
						<Title>Тип: </Title>
						<p>{`${type.name ? type.name : ''}`}</p>
					</List.Item>
					<List.Item>
						<Title>Гос. номер:</Title>
						<p>{`${licensePlate ? licensePlate : ''}`}</p>
					</List.Item>
				</div>
			</Card>
			<FloatButton
				// visible={visibleEditButton}
				onClick={editMachineHandler}
				// placement='right'
				// icon={{ name: 'edit', color: 'white' }}
				// color='green'
			/>
			<Modal
				title='Basic Modal'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				okText='Печать'
				cancelText='Отмена'
				width={'100%'}
				styles={{
					body: {
						minHeight: '60vh',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
					},
				}}
			>
				<PDFViewer width={'100%'} showToolbar={true} style={{ flex: 1, height: '100%' }}>
					<PrintForm />
				</PDFViewer>
			</Modal>
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
