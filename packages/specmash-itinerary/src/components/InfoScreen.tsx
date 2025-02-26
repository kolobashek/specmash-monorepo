import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Text, View } from 'react-native'
import store from '../store'

export const InfoScreen = observer(() => {
	return (
		<View>
			<Text>INFO</Text>

			<Button
				title='Отменить регистрацию'
				onPress={() => {
					// store.setRegistrationMessage('')
				}}
			/>
		</View>
	)
})
