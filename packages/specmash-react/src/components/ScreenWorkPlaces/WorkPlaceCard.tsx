import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from '../../utils'
import { IWorkPlace } from '../../store/workPlaceStore'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Divider, FloatButton, Input, List } from 'antd'
import Title from 'antd/es/typography/Title'

export const WorkPlaceCard = observer(({ navigation }: any) => {
	const linkTo = useNavigate()
	const { id } = useParams()
	const {
		currentWorkPlace,
		setCurrentWorkPlace,
		getWorkPlaceById,
		getWorkPlaces,
		updateWorkPlace,
		clearWorkPlaceData,
		setWorkPlaceData,
		workPlaceData,
	} = store.workPlaces
	const workPlaceId = Number(id)
	useEffect(() => {
		const user = async () => {
			const input = await getWorkPlaceById(workPlaceId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setWorkPlaceData(input)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editWorkPlaceHandler = () => {
		linkTo(`/workplaces/${workPlaceId}/edit`)
	}
	const editWorkPlaceSubmit = async (id: number) => {
		setLoading(true)
		const newWorkPlace = await updateWorkPlace({ id, ...workPlaceData })
		if (newWorkPlace instanceof Error) {
			console.log(newWorkPlace)
			setUpdateError(newWorkPlace.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentWorkPlace(newWorkPlace)
		setVisibleEditButton(true)
		setLoading(false)
		clearWorkPlaceData()
		return newWorkPlace
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setWorkPlaceInput({ isActive: !isActive })
	// }
	if (!currentWorkPlace) return <p>Что-то пошло не так.</p>
	if (!visibleEditButton)
		return (
			<>
				<Card title={currentWorkPlace.name}>
					<Divider />
					<div>
						<List.Item>
							<Title>Контакты:</Title>
							<Input
								placeholder='Контакты'
								value={workPlaceData.contacts}
								onChange={(text) => setWorkPlaceData({ contacts: text.target.value })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</List.Item>
						<List.Item>
							{/* <ListItem.Title>Роль: </ListItem.Title>
							<Dropdown
								style={styles.dropdown}
								placeholderStyle={styles.placeholderStyle}
								selectedTextStyle={styles.selectedTextStyle}
								inputSearchStyle={styles.inputSearchStyle}
								iconStyle={styles.iconStyle}
								data={roles.map((role) => {
									return { label: roleName(role), value: role }
								})}
								search
								maxHeight={300}
								labelField='label'
								valueField='value'
								placeholder='Select item'
								searchPlaceholder='Search...'
								value={workPlaceInput.role}
								onChange={(role) => setWorkPlaceInput({ role: role.value })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<div style={styles.item}>
											<p style={styles.textItem}>{item.label}</p>
											{item.value === workPlaceInput.role && (
												<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
											)}
										</div>
									)
								}}
								disable={loading}
							/> */}
							<Title>Адрес:</Title>
							<Input
								placeholder='Адрес'
								value={workPlaceData.address}
								onChange={(text) => setWorkPlaceData({ address: text.target.value })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</List.Item>
						{/* <ListItem>
							<ListItem.Title>Комментарий:</ListItem.Title>
							<ListItem.Input
								placeholder='Комментарии'
								value={workPlaceInput.comment}
								onChangeText={(text) => setWorkPlaceInput({ comment: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem> */}
					</div>
					{updateError && (
						<>
							<Divider />
							<p style={{ color: 'red' }}>{updateError}</p>
						</>
					)}
				</Card>
				<FloatButton
					// visible={!visibleEditButton || !loading}
					onClick={() => editWorkPlaceSubmit(workPlaceId)}
					// placement='left'
					// icon={{ name: 'check', color: 'white' }}
					// color='green'
				/>
				<FloatButton
					// visible={!visibleEditButton || !loading}
					onClick={editWorkPlaceHandler}
					// placement='right'
					// icon={{ name: 'cancel', color: 'white' }}
					// color='red'
				/>
			</>
		)
	return (
		<>
			<Card>
				<Title>{currentWorkPlace.name}</Title>
				<Divider />
				<div>
					<List.Item>
						<Title>Контакты:</Title>
						<p>{currentWorkPlace.contacts}</p>
					</List.Item>
					<List.Item>
						<Title>Адрес: </Title>
						<p>{currentWorkPlace.address}</p>
					</List.Item>
					{/* <ListItem>
						<ListItem.Title>Комментарий:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentWorkPlace.comment ? currentWorkPlace.comment : ''
						}`}</ListItem.Subtitle>
					</ListItem> */}
				</div>
			</Card>
			<FloatButton
				// visible={visibleEditButton}
				onClick={editWorkPlaceHandler}
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
