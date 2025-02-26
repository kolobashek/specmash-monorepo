import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Avatar, Breadcrumb, FloatButton, List } from 'antd'
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons'

export const MachinesList = observer(() => {
	const {
		machines,
		machineData,
		types,
		setMachineData,
		createMachine,
		clearMachineData,
		getMachines,
	} = store.machines
	const linkTo = useNavigate()
	useEffect(() => {
		getMachines()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const addMachineHandler = async () => {
		linkTo('/machines/new')
	}
	const addMachineSubmit = async () => {
		setLoading(true)
		const newMachine = await createMachine(machineData)
		if (newMachine instanceof Error) {
			console.log(newMachine)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearMachineData()
		getMachines()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	// const typesList = [
	// 	...types.map((type) => {
	// 		return {
	// 			key: type.id,
	// 			title: type.name,
	// 			containerStyle: { backgroundColor: 'white' },
	// 			titleStyle: { color: 'black' },
	// 			onPress: async () => {
	// 				setMachineData({ type: type.name })
	// 				setIsVisibleBS(false)
	// 			},
	// 		}
	// 	}),
	// 	{
	// 		title: 'Cancel',
	// 		containerStyle: { backgroundColor: 'red' },
	// 		titleStyle: { color: 'white' },
	// 		onPress: () => {
	// 			setIsVisibleBS(false)
	// 			setVisibleAddButton(true)
	// 		},
	// 	},
	// ]
	return (
		<>
			<Breadcrumb
				separator='>'
				items={[
					{
						title: 'Главная',
						href: '/',
					},
					{
						title: 'Машины',
					},
				]}
			/>
			<List
				itemLayout='horizontal'
				dataSource={machines}
				style={{
					maxWidth: 600,
					margin: '0 auto',
				}}
				renderItem={(machine) => {
					return (
						<List.Item
							actions={[
								<Link key='1' to={`/machines/${machine.id}`}>
									Подробнее
								</Link>,
								<Link key='2' to={`/machines/${machine.id}/edit`}>
									Изменить
								</Link>,
							]}
						>
							<List.Item.Meta
								avatar={
									<Avatar
										size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
										icon={<UserOutlined />}
									>
										{machine.name[0]}
									</Avatar>
								}
								title={
									<Link to={`/machines/${machine.id}`} key={machine.id}>
										{machine.name}
									</Link>
								}
								description={`Тип: ${machine.type.name}`}
							/>
						</List.Item>
					)
				}}
			/>
			<Outlet />
			<FloatButton
				onClick={addMachineHandler}
				icon={<PlusCircleOutlined />}
				tooltip='Добавить пользователя'
			/>
		</>
		/* {machines.map((machine) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/machines/${machine.id}`
										: { screen: 'MachineDetails', params: { id: machine.id } }
								}
								key={machine.id}
								style={[styles.link]}
							>
								<ListItem key={machine.id} bottomDivider>
									<ListItem.Content>
										<ListItem.Title>{machine.name}</ListItem.Title>
										<ListItem.Subtitle>{machine.type}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.dimensions}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.weight}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.licensePlate}</ListItem.Subtitle>
										<ListItem.Subtitle>{machine.nickname}</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							</Link>
						)
					})}
					{!visibleAddButton && (
						<>
							<div style={[styles.row]}>
								<div style={styles.cell}>
									<Input
										placeholder='Марка/модель'
										value={machineData.name}
										onChangeText={(e) => setMachineData({ name: e })}
										disabled={loading}
									/>
								</div>
								<div style={styles.cell}>
									<Button
										title={machineData.type || 'Тип'}
										onPress={() => setIsVisibleBS(true)}
										disabled={loading}
									/>
									<BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{typesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet>
								</div>
								<div style={styles.cell}>
									<Input
										placeholder='Габариты'
										value={machineData.dimensions}
										onChangeText={(e) => setMachineData({ dimensions: e })}
										disabled={loading}
									/>
								</div>
								<div style={styles.cell}>
									<Input
										placeholder='Масса, кг'
										value={machineData.weight.toString()}
										onChangeText={(e) => setMachineData({ weight: e })}
										disabled={loading}
									/>
								</div>
								<div style={styles.cell}>
									<Input
										placeholder='Гос. номер'
										value={machineData.licensePlate}
										onChangeText={(e) => setMachineData({ licensePlate: e })}
										disabled={loading}
									/>
								</div>
								<div style={styles.cell}>
									<Input
										placeholder='Псевдоним'
										value={machineData.nickname}
										onChangeText={(e) => setMachineData({ nickname: e })}
										disabled={loading}
									/>
								</div>
							</div>
							<div style={styles.row}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!machineData.name || !machineData.type || loading}
									onPress={addMachineSubmit}
									loading={loading}
								/>
								<Button
									color={'red'}
									icon={{ name: 'cancel', color: 'white' }}
									onPress={cancelHandler}
									disabled={loading}
								/>
							</div>
						</>
					)}
				</div>
			</div>
			<FloatButton
				onClick={() => linkTo('/machines/new')}
				icon={<PlusCircleOutlined style={{ fontWeight: 'bold' }} />}
				tooltip='Добавить'
				type='primary'
			/>
		</> */
	)
})

// const styles = StyleSheet.create({
// 	container: {
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
// 	link: {
// 		display: 'flex',
// 		flex: 1,
// 	},
// 	row: {
// 		flexDirection: 'row',
// 		borderBottomWidth: 1,
// 		borderColor: '#ddd',
// 	},
// 	header: {
// 		flexDirection: 'row',
// 		borderBottomWidth: 2, // увеличили толщину линии для заголовка
// 	},
// 	cell: {
// 		flex: 1,
// 		padding: 10,
// 		textAlign: 'center', // выравнивание по центру
// 	},
// 	cellHeader: {
// 		flex: 1,
// 		padding: 10,
// 		fontWeight: 'bold', // жирный шрифт
// 		textAlign: 'center',
// 	},
// })

// const cols = [
// 	{ key: 'name', label: 'Марка/модель' },
// 	{ key: 'type', label: 'Тип' },
// 	{ key: 'dimensions', label: 'Габариты' },
// 	{ key: 'weight', label: 'Масса' },
// 	{ key: 'licensePlate', label: 'ГРЗ' },
// 	{ key: 'nickname', label: 'Кодовое имя' },
// ]
