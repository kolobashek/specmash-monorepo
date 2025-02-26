import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Text } from '@rneui/themed'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import { ContrAgentForm } from './ContrAgentForm'

type Props = StackScreenProps<ContrAgentsStackParamList, 'ContrAgentEdit'>

export const ContrAgentEdit = observer(({ navigation }: Props) => {
	const contrAgentId = Number(
		navigation.getState().routes.find((r) => r.name === 'ContrAgentEdit')?.params?.id
	)
	const linkTo = useLinkTo()
	const { updateContrAgent, contrAgentData } = store.contrAgents
	const [loading, setLoading] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const createContrAgentSubmit = async () => {
		setLoading(true)
		const updatedContrAgent = await updateContrAgent({ id: contrAgentId, ...contrAgentData })
		if (updatedContrAgent instanceof Error) {
			console.log(updatedContrAgent)
			setUpdateError(updatedContrAgent.message)
			setLoading(false)
			return updatedContrAgent
		}
		setUpdateError('')
		// setCurrentContrAgent(updatedContrAgent)
		setLoading(false)
		return linkTo(`/workplaces/contragents/${updatedContrAgent.id}`)
	}
	const cancelHandler = () => {
		linkTo(`/workplaces/contragents/${contrAgentId}`)
	}
	if (loading) return <Text>Loading...</Text>
	return (
		<>
			<ContrAgentForm contrAgentId={contrAgentId} error={updateError} loading={loading} />
			<FAB
				visible={!loading}
				onPress={createContrAgentSubmit}
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
