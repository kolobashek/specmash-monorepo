import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IObject } from '../../store/objectStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ObjectStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { ObjectForm } from './ObjectForm'
import { IContrAgent } from '../../store/contrAgentStore'

type Props = StackScreenProps<ObjectStackParamList, 'ObjectEdit'>

export const ObjectEdit = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const {
		createObject,
		clearObjectData,
		setObjectData,
		objectData,
		getObjectById,
		setCurrentObject,
		updateObject,
	} = store.objects
	const objectId = Number(
		navigation.getState().routes.find((r) => r.name === 'ObjectEdit')?.params?.id
	)
	console.log(navigation.getState().routes)
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')
	const [allContAgents, setAllContAgents] = useState([] as IContrAgent[])
	const { getContrAgents } = store.contrAgents

	useEffect(() => {
		const start = async () => {
			const objFromApi = await getObjectById(objectId)
			if (objFromApi instanceof Error) {
				return linkTo(`/workplaces/objects/${objectId}`)
			}
			const contrAgentsFromApi = await getContrAgents()
			if (contrAgentsFromApi instanceof Error) {
				return
			}
			setAllContAgents(contrAgentsFromApi)
			setObjectData(objFromApi)
		}
		start()
	}, [])

	const cancelHandler = () => {
		linkTo(`/workplaces/objects/${objectId}`)
	}
	const createObjectSubmit = async () => {
		setLoading(true)
		const updatedObject = await updateObject({ id: objectId, ...objectData })
		if (updatedObject instanceof Error) {
			console.log(updatedObject)
			setCreateError(updatedObject.message)
			setLoading(false)
			return updatedObject
		}
		setCreateError('')
		setCurrentObject(updatedObject)
		setLoading(false)
		return linkTo(`/objects/${updatedObject.id}`)
	}
	if (loading) return <Text>Loading...</Text>
	return (
		<>
			<ObjectForm objectId={objectId} error={updateError} loading={loading} />
			<FAB
				visible={!loading}
				onPress={createObjectSubmit}
				placement='left'
				icon={{ name: 'check', color: 'white' }}
				color='green'
			/>
			<FAB
				visible={!loading}
				onPress={cancelHandler}
				placement='right'
				icon={{ name: 'cancel', color: 'white' }}
				color='red'
			/>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	dropdown: {
		margin: 16,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
})
