import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from '../../utils'
import { IWorkPlaceData } from '../../store/workPlaceStore'
import { IWorkPlace } from '../../store/workPlaceStore'
import { IPartner } from '../../store/partnerStore'
import { Button, Card, Divider, Form, Input, List, Select, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import { useNavigate, useParams } from 'react-router-dom'

export const WorkPlaceForm = observer(() => {
	const { id } = useParams()
	const workPlaceId = Number(id)
	const linkTo = useNavigate()
	const {
		workPlaceData,
		setWorkPlaceData,
		getWorkPlaceById,
		createWorkPlace,
		clearWorkPlaceData,
		updateWorkPlace,
	} = store.workPlaces
	const { getPartners } = store.partners

	const [loading, setLoading] = useState(false)
	const [formError, setFormError] = useState('')
	const [partners, setPartners] = useState([] as IPartner[])
	useEffect(() => {
		const start = async () => {
			const allPartners = await getPartners()
			if (allPartners instanceof Error) {
				setFormError(allPartners.message)
				return
			}
			setPartners(allPartners)
			if (workPlaceId) {
				const currentWorkPlace = await getWorkPlaceById(workPlaceId)
				if (currentWorkPlace instanceof Error) {
					return
				}
				setWorkPlaceData(currentWorkPlace)
			}
		}
		start()
	}, [workPlaceId])
	const inputChange = (input: Partial<IWorkPlaceData>) => {
		setWorkPlaceData({
			...workPlaceData,
			...input,
		})
	}
	const submitHandler = async () => {
		setLoading(true)
		const createOrUpdate = async () => {
			if (workPlaceId) {
				return await updateWorkPlace({ id: workPlaceId, ...workPlaceData })
			}
			return await createWorkPlace(workPlaceData)
		}
		const createdWorkPlace = await createOrUpdate()
		if (createdWorkPlace instanceof Error) {
			console.log(createdWorkPlace)
			setFormError(createdWorkPlace.message)
			setLoading(false)
			return createdWorkPlace
		}
		clearWorkPlaceData()
		setFormError('')
		setLoading(false)
		return linkTo(`/workplaces/${createdWorkPlace.id}`)
	}
	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}
	const changePartnersHandler = (value: any, options: any) => {
		// console.log(value, options)
		setWorkPlaceData({ partners: options })
	}
	return (
		<Form
			name='workplace'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			onFinish={submitHandler}
			onFinishFailed={onFinishFailed}
			autoComplete='off'
		>
			<h1>
				{`${workPlaceData.name || 'Новый объект'}` +
					(workPlaceData.partners.length
						? `, ${workPlaceData.partners.map((ca) => ca.name).join(', ')}`
						: '')}
			</h1>
			<Divider />
			<div>
				<Form.Item label='Наименование:'>
					<Input
						placeholder={workPlaceData.name || 'Наименование'}
						value={workPlaceData.name}
						onChange={(e) => inputChange({ name: e.target.value })}
						disabled={loading}
					/>
				</Form.Item>
				<Form.Item label='Адрес'>
					<Input
						placeholder='Введите адрес'
						value={workPlaceData.address}
						onChange={(e) => {
							inputChange({ address: e.target.value })
						}}
						disabled={loading}
						// style={{ textAlign: 'left' }}
					/>
				</Form.Item>
				<Form.Item label='Контакты'>
					<Input
						placeholder='телефон, email, ФИО, должность'
						value={workPlaceData.contacts}
						onChange={(e) => {
							inputChange({ contacts: e.target.value })
						}}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</Form.Item>
				<Form.Item label='Контрагенты'>
					<Select
						options={partners}
						mode='multiple'
						placeholder={'Выберите организации на этом объекте'}
						value={workPlaceData.partners.map((obj) => obj.id)}
						onChange={changePartnersHandler}
						fieldNames={{ label: 'name', value: 'id' }}
						disabled={loading}
					/>
				</Form.Item>
				{/* <ListItem>
					<ListItem.Title>Комментарий:</ListItem.Title>
					<ListItem.Input
						placeholder={comment || 'Комментарий'}
						value={comment}
						onChangeText={setWorkPlaceComment}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem> */}
			</div>
			{formError && (
				<>
					<Divider />
					<p style={{ color: 'red' }}>{formError}</p>
				</>
			)}
			<Form.Item>
				<Space>
					<Button type='primary' htmlType='submit' disabled={!workPlaceData.name?.length}>
						Записать
					</Button>
					<Button
						type='primary'
						htmlType='reset'
						danger
						onClick={() => {
							clearWorkPlaceData()
							linkTo(workPlaceId ? `/workplaces/${workPlaceId}` : '/workplaces')
						}}
					>
						Отмена
					</Button>
				</Space>
			</Form.Item>
		</Form>
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
