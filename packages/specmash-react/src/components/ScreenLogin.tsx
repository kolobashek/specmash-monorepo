import React, { useState, useEffect } from 'react'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Space } from 'antd'
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom'
import store from '../store'
import { observer } from 'mobx-react-lite'

const ScreenLogin = observer(() => {
	const location = useLocation()
	const params = new URLSearchParams(location.search)
	const from = params.get('from') || '/'
	const navigate = useNavigate()
	const { isAuthenticated } = store.auth
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from || '/')
		}
	}, [isAuthenticated])
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleLogin = async () => {
		try {
			await store.auth.login(phone, password)
			if (store.auth.isAuthenticated === true) {
				redirect(from || '/')
			}
		} catch (catchedError) {
			setPassword('')
			console.log('catchedError', catchedError)
		}
	}
	return (
		<div style={{ maxWidth: '300px', margin: '0 auto' }}>
			<h1>ВХОД</h1>
			<Form
				name='normal_login'
				className='login-form'
				initialValues={{ remember: true }}
				onFinish={handleLogin}
			>
				<Form.Item name='phone' rules={[{ required: true, message: 'Введите номер телефона!' }]}>
					<Input
						prefix={<PhoneOutlined className='site-form-item-icon' />}
						placeholder='Номер телефона'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</Form.Item>
				<Form.Item name='password' rules={[{ required: true, message: 'Введите пароль!' }]}>
					<Input
						prefix={<LockOutlined className='site-form-item-icon' />}
						type='password'
						placeholder='Пароль'
						value={password}
						onChange={(e) => {
							setPassword(e.target.value), setErrorMessage('')
						}}
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item name='remember' valuePropName='checked' noStyle>
						<Checkbox>Запомнить меня</Checkbox>
					</Form.Item>

					<a className='login-form-forgot' href=''>
						Забыли пароль?
					</a>
				</Form.Item>

				<Form.Item>
					<Space>
						<Button
							type='primary'
							htmlType='submit'
							className='login-form-button'
							disabled={!phone.length || !password.length}
						>
							Войти
						</Button>
						или <Link to='/register'>Зарегистрироваться!</Link>
					</Space>
				</Form.Item>
			</Form>
		</div>
	)
})

// const styles = StyleSheet.create({
// 	container: {
// 		// Flex: 1,
// 		marginTop: '2%',
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		minWidth: 300,
// 		maxWidth: 400,
// 		marginHorizontal: 'auto',
// 	},
// 	title: {
// 		fontSize: 24,
// 		fontWeight: 'bold',
// 		marginBottom: 20,
// 	},
// 	inputContainer: {
// 		width: '80%',
// 		marginBottom: 20,
// 	},
// 	input: {
// 		borderWidth: 1,
// 		borderColor: '#777',
// 		padding: 8,
// 		marginBottom: 10,
// 		width: '100%',
// 	},
// 	label: {
// 		fontSize: 16,
// 		marginBottom: 8,
// 	},
// 	linkButton: {},
// 	passIcons: {
// 		flexDirection: 'row',
// 	},
// 	inputStyle: {
// 		paddingLeft: 20,
// 		fontSize: 12,
// 	},
// 	passIcon: {
// 		paddingLeft: 5,
// 	},
// })

export { ScreenLogin }
