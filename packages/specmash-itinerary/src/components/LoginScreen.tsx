import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Button, Input, Card } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import store from '../store'
import { observer } from 'mobx-react-lite'
import { RouteProp, useLinkTo } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginScreen = observer(({ navigation }: any) => {
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const linkTo = useLinkTo()

	useEffect(() => {
		if (store.auth.userAuthorized) {
			linkTo('/info')
		}
	}, [store.auth.userAuthorized])

	const handleLogin = async () => {
		try {
			await store.auth.login(phone, password)
		} catch (catchedError) {
			setPassword('')
			console.log('catchedError', catchedError)
		}
	}
	return (
		<View style={styles.container}>
			<Card>
				<Card.Title>ВХОД</Card.Title>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage={''}
					errorStyle={{}}
					errorProps={{}}
					inputStyle={styles.inputStyle}
					label='Вход:'
					value={phone}
					labelStyle={{}}
					labelProps={{}}
					leftIcon={<Icon name='phone-outline' size={20} />}
					leftIconContainerStyle={{}}
					rightIcon={
						<Icon
							name='close'
							color={phone.length ? '#000' : '#ddd'}
							size={20}
							onPress={() => setPhone('')}
							aria-hidden={!phone.length}
						/>
					}
					rightIconContainerStyle={{}}
					placeholder='Введите номер'
					onChangeText={setPhone}
					// disabled={loading}
				/>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage={errorMessage}
					errorStyle={{}}
					errorProps={{}}
					inputStyle={styles.inputStyle}
					labelStyle={{}}
					labelProps={{}}
					leftIconContainerStyle={{}}
					rightIcon={
						<Icon
							name='close'
							color={password.length ? '#000' : '#ddd'}
							size={20}
							style={styles.passIcon}
							onPress={() => setPassword('')}
							aria-hidden={!password.length}
						/>
					}
					rightIconContainerStyle={{}}
					placeholder='Введите пароль'
					value={password}
					onChangeText={(e) => {
						setPassword(e), setErrorMessage('')
					}}
					onSubmitEditing={handleLogin}
					secureTextEntry
					// disabled={loading}
				/>
				<Button title='Войти' onPress={handleLogin} disabled={!phone.length || !password.length} />

				<Button
					title='Зарегистрироваться'
					onPress={() => {
						navigation.navigate('register')
					}}
					type='clear'
				/>
			</Card>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		// Flex: 1,
		marginTop: '2%',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 300,
		maxWidth: 400,
		marginHorizontal: 'auto',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	inputContainer: {
		width: '80%',
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#777',
		padding: 8,
		marginBottom: 10,
		width: '100%',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	linkButton: {},
	passIcons: {
		flexDirection: 'row',
	},
	inputStyle: {
		paddingLeft: 20,
		fontSize: 12,
	},
	passIcon: {
		paddingLeft: 5,
	},
})

export { LoginScreen }
