import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Button, Input, Card } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { registerUser } from '../services/api/auth'

const RegisterScreen = () => {
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('user')
	const registerUser = async ({
		name,
		phone,
		password,
		role,
	}: {
		name: string
		phone: string
		password: string
		role: string
	}) => {
		console.log({ name, phone, password, role })
	}

	return (
		<View style={styles.container}>
			<Card>
				<Card.Title>РЕГИСТРАЦИЯ</Card.Title>

				<Input
					containerStyle={{}}
					// disabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage="Oops! that's not correct."
					errorStyle={{}}
					errorProps={{}}
					inputStyle={{}}
					label='Вход:'
					labelStyle={{}}
					labelProps={{}}
					leftIcon={<Icon name='phone-outline' size={20} />}
					leftIconContainerStyle={{}}
					rightIcon={<Icon name='close' size={20} />}
					rightIconContainerStyle={{}}
					onChangeText={setName}
					placeholder='Введите ФИО'
				/>
				<Input
					style={{}}
					value={phone}
					onChangeText={setPhone}
					keyboardType='phone-pad'
					inputMode='tel'
				/>
				<Input style={{}} value={password} onChangeText={setPassword} secureTextEntry />

				{/* <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Пользователь" value="user" />
          <Picker.Item label="Админ" value="admin" />
        </Picker> */}

				<Button
					title='Зарегистрироваться'
					onPress={() => registerUser({ name, phone, password, role })}
				/>
			</Card>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
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
	inputContainerStyle: {},
	passIcon: {
		paddingLeft: 5,
	},
})

export { RegisterScreen }
