import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IPartnerData } from '../../store/partnerStore'
import { IWorkPlace } from '../../store/workPlaceStore'
import { Button, Checkbox, Divider, Form, Input, Select, Space } from 'antd'

type Props = {
	partnerId?: number
	loading: boolean
	error: string
	submitHandler: (values?: any) => void
}

export const PartnerForm = observer(({ partnerId, loading, error, submitHandler }: Props) => {
	const { setPartnerData, partnerData, getPartnerById } = store.partners
	const { getWorkPlaces } = store.workPlaces
	const [allWorkPlaces, setAllWorkPlaces] = useState([] as IWorkPlace[])
	const { name, contacts, address, comments, workPlaces } = partnerData
	const inputChange = (input: Partial<IPartnerData>) => {
		setPartnerData({
			...partnerData,
			...input,
		})
	}
	useEffect(() => {
		const start = async () => {
			if (partnerId) {
				const initialData = await getPartnerById(partnerId)
				setPartnerData(initialData)
			}
			const workPlacesFromApi = await getWorkPlaces()
			if (workPlacesFromApi instanceof Error) {
				return
			}
			setAllWorkPlaces(workPlacesFromApi)
		}
		start()
	}, [])
	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}
	const handleChangeWorkPlace = (value: string[]) => {
		const selectedWorkPlaces = allWorkPlaces.filter((ca) => value.includes(String(ca.id)))
		if (selectedWorkPlaces.length > 0) {
			inputChange({ workPlaces: selectedWorkPlaces })
		} else {
			inputChange({ workPlaces: [] })
		}
	}
	return (
		<div style={{ maxWidth: '600px', margin: '0 auto' }}>
			<Form
				name='partner'
				// labelCol={{ span: 8 }}
				// wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={submitHandler}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<h1>Контрагент</h1>
				<Form.Item>
					{`${partnerData.name}` +
						(partnerData.workPlaces?.length
							? ` //${partnerData.workPlaces.map((obj) => obj.name).join(', ')}`
							: '')}
				</Form.Item>
				<Divider />
				<div>
					<Form.Item label='Наименование:'>
						<Input
							placeholder={partnerData.name || 'Наименование'}
							value={name}
							onChange={(e) => inputChange({ name: e.target.value })}
							disabled={loading}
						/>
					</Form.Item>
					<Form.Item label='Адрес:'>
						<Input
							placeholder='Введите адрес - физический или юридический'
							value={address}
							onChange={(e) => inputChange({ address: e.target.value })}
							disabled={loading}
							style={{ textAlign: 'left' }}
						/>
					</Form.Item>
					<Form.Item label='Контакты:'>
						<Input
							placeholder='телефон, email, ФИО, должность'
							value={contacts}
							onChange={(e) => {
								inputChange({ contacts: e.target.value })
							}}
							disabled={loading}
							style={{ textAlign: 'left' }}
						/>
					</Form.Item>
					<Form.Item label='Объекты:'>
						<Select
							mode='multiple'
							// size={size}
							placeholder='Please select'
							// defaultValue={['a10', 'c12']}
							onChange={handleChangeWorkPlace}
							style={{ width: '100%' }}
							options={allWorkPlaces}
						/>
						{/* <MultiSelect
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={allWorkPlaces}
						search
						searchField='name'
						maxHeight={300}
						labelField={'name'}
						valueField={'id'}
						placeholder={workPlaces.map((obj) => obj.name).join(', ') || 'Выберите объекты'}
						searchPlaceholder='Найти...'
						value={workPlaces?.map((obj) => obj.name || '')}
						onChange={(value: string[]) => {
							const selectedWorkPlaces = allWorkPlaces.filter((ca) => value.includes(String(ca.id)))
							if (selectedWorkPlaces.length > 0) {
								inputChange({ workPlaces: selectedWorkPlaces })
							} else {
								inputChange({ workPlaces: [] })
							}
						}}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<div style={styles.item}>
									<p style={styles.textItem}>{item.name}</p>
									{item.id === partnerData.workPlaces?.find((obj) => obj.id === item.id)?.id && (
										<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
									)}
								</div>
							)
						}}
						disable={loading}
					/> */}
					</Form.Item>
					<Form.Item label='Комментарий:'>
						<Input
							placeholder={comments || 'Комментарий'}
							value={comments}
							onChange={(e) => {
								inputChange({ comments: e.target.value })
							}}
							disabled={loading}
							style={{ textAlign: 'left' }}
						/>
					</Form.Item>
				</div>
				{error && (
					<>
						<Divider />
						<p style={{ color: 'red' }}>{error}</p>
					</>
				)}
				<Form.Item>
					<Space>
						<Button
							type='primary'
							htmlType='submit'
							className='login-form-button'
							disabled={!partnerData.name.length}
						>
							Записать
						</Button>
						<Button type='primary' htmlType='reset' className='login-form-button' danger>
							Отмена
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</div>
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
