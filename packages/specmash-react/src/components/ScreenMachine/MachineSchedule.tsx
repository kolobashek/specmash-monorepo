import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { localizedRoleName } from '../../utils'
import { IMachineData, MachineType } from '../../store/machinesStore'
import { Card, Divider, Input, List } from 'antd'
import Title from 'antd/es/typography/Title'

type Props = {
	shifts: any
}

export const MachineSchedule = ({ shifts }: Props) => {
	const { machineData, setMachineData } = store.machines
	return (
		<Card>
			<Title>
				{`${machineData.name}` + (machineData.nickname ? `, ${machineData.nickname}` : '')}
			</Title>
			<Divider />
			<div>
				<List.Item>
					<Title>Наименование:</Title>
					<Input
						placeholder={machineData.name || 'Наименование'}
						value={machineData.name}
						onChange={(e) => setMachineData({ name: e.target.value })}
						// disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</List.Item>
				{/* <ListItem>
					<ListItem.Title>Позывной:</ListItem.Title>
					<ListItem.Input
						placeholder={nickname || 'Позывной'}
						value={nickname}
						onChangeText={setMachineNickname}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Вес, кг:</ListItem.Title>
					<ListItem.Input
						placeholder='12000'
						value={weight}
						onChangeText={setMachineWeight}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Тип: </ListItem.Title>
					<Dropdown
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={types.map((type) => {
							return { label: type.name, value: type.id }
						})}
						search
						maxHeight={300}
						labelField='label'
						valueField='value'
						placeholder={type || 'Выберите тип'}
						searchPlaceholder='Search...'
						value={machineData.type}
						onChange={(type) => setMachineType(type.label)}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<div style={styles.item}>
									<p style={styles.textItem}>{item.label}</p>
									{item.label === machineData.type && (
										<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
									)}
								</div>
							)
						}}
						disable={loading}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Гос. номер:</ListItem.Title>
					<ListItem.Input
						placeholder='А 000 АА 000'
						value={licensePlate}
						onChangeText={setMachineLicensePlate}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem> */}
			</div>
			{/* {error && (
				<>
					<Card.Divider />
					<p style={{ color: 'red' }}>{error}</p>
				</>
			)} */}
		</Card>
	)
}

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
