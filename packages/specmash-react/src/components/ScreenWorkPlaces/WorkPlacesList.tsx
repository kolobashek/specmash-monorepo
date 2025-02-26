import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { WorkPlaceCard } from './WorkPlaceCard'
import { redirect, useNavigate } from 'react-router-dom'
import Link from 'antd/es/typography/Link'
import { Avatar, Button, FloatButton, Input, List } from 'antd'
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons'

export const WorkPlacesList = observer(() => {
	const linkTo = useNavigate()
	const {
		list,
		workPlaceData,
		setWorkPlaceData,
		createWorkPlace,
		clearWorkPlaceData,
		getWorkPlaces,
	} = store.workPlaces
	useEffect(() => {
		getWorkPlaces()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const addWorkPlaceHandler = async () => {
		setVisibleAddButton(false)
	}
	const addWorkPlaceSubmit = async () => {
		setLoading(true)
		const newWorkPlace = await createWorkPlace(workPlaceData)
		if (newWorkPlace instanceof Error) {
			console.log(newWorkPlace)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearWorkPlaceData()
		getWorkPlaces()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		// setWorkPlaceData({ isActive: !isActive })
	}
	return (
		<>
			<div>
				<div>
					{list.map((workPlace) => {
						return (
							<Link href={`/workPlaces/${workPlace.id}`} key={workPlace.id}>
								<List.Item>
									<Avatar
										// title={workPlace.name?.charAt(0).toUpperCase()}
										// containerStyle={{ backgroundColor: 'grey' }}
										icon={<UserOutlined />}
									/>
									<p>{workPlace.name}</p>
									<p>{workPlace.address}</p>
									<p>{workPlace.contacts}</p>
								</List.Item>
							</Link>
						)
					})}
					{!visibleAddButton && (
						<>
							<div>
								<div>
									<Input
										placeholder='Наименование'
										value={workPlaceData.name}
										onChange={(e) => setWorkPlaceData({ name: e.target.value })}
										disabled={loading}
									/>
								</div>
								<div>
									<Input
										placeholder='Контакты'
										value={workPlaceData.contacts}
										onChange={(e) => {
											console.log(e)
											setWorkPlaceData({ contacts: e.target.value })
										}}
										disabled={loading}
									/>
								</div>
								<div>
									<Input
										placeholder='Адрес'
										value={workPlaceData.address}
										onChange={(e) => setWorkPlaceData({ address: e.target.value })}
										disabled={loading}
									/>
								</div>
								{/* <div style={styles.inputsCell}>
									<Input
										placeholder='Комментарий'
										value={workPlaceData.comment}
										onChangeText={(e) => setWorkPlaceData({ comment: e })}
										disabled={loading}
									/>
								</div> */}
								<div></div>
							</div>
							<div>
								<Button
									// style={styles.row}
									color={'green'}
									// icon={{ name: 'check', color: 'white' }}
									disabled={!workPlaceData.name || loading}
									onClick={addWorkPlaceSubmit}
									loading={loading}
								/>
								<Button
									color={'red'}
									// icon={{ name: 'cancel', color: 'white' }}
									onClick={cancelHandler}
									disabled={loading}
								/>
							</div>
						</>
					)}
				</div>
			</div>
			<FloatButton
				onClick={() => linkTo('/workPlaces/new')}
				icon={<PlusCircleOutlined />}
				tooltip='Добавить новый объект'
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
// 	link: {
// 		display: 'flex',
// 		flex: 1,
// 	},
// 	title: {
// 		fontSize: 20,
// 		textAlign: 'center',
// 		marginVertical: 20,
// 	},
// 	table: {
// 		flex: 1,
// 		paddingHorizontal: 16, // добавили горизонтальный padding
// 	},
// 	row: {
// 		flex: 1,
// 		flexDirection: 'row',
// 		// borderBottomWidth: 1,
// 		// borderColor: '#ddd',
// 	},
// 	header: {
// 		flex: 1,
// 		flexDirection: 'row',
// 		borderBottomWidth: 2, // увеличили толщину линии для заголовка
// 	},
// 	cell: {
// 		flex: 1,
// 		padding: 10,
// 		textAlign: 'left', // выравнивание по центру
// 	},
// 	cellHeader: {
// 		padding: 10,
// 		fontWeight: 'bold', // жирный шрифт
// 		textAlign: 'left',
// 	},
// 	inputsCell: {
// 		flex: 1,
// 		flexDirection: 'row',
// 	},
// 	inputsSubmitRow: {
// 		flexDirection: 'row',
// 		justifyContent: 'flex-end',
// 	},
// })

// const cols = [
// 	{ key: 'name', label: 'ФИО' },
// 	{ key: 'phone', label: 'Телефон' },
// 	{ key: 'nickname', label: 'Псевдоним' },
// 	{ key: 'comment', label: 'Комментарий' },
// 	{ key: 'role', label: 'Роль' },
// 	// { key: 'isActive', label: 'Активен' },
// ]
