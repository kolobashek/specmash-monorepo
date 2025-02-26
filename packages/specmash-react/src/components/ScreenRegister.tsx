import { Button, Form, Input, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import store from '../store'
// import { registerUser } from '../services/api/auth'

const ScreenRegister = () => {
	const location = useLocation()
	const params = new URLSearchParams(location.search)
	const from = params.get('from') || '/'
	const navigate = useNavigate()
	const { isAuthenticated } = store.auth
	const [form] = Form.useForm()
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from || '/')
		}
	}, [isAuthenticated])
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
	const registerHandler = async () => {
		registerUser({ name, phone, password, role })
	}
	const prefixSelector = (
		<Form.Item name='prefix' noStyle>
			<Select style={{ width: 70 }}>
				<Select.Option value='7'>+7</Select.Option>
				{/* <Select.Option value='87'>+87</Select.Option> */}
			</Select>
		</Form.Item>
	)
	return (
		<div style={{ maxWidth: '600px', margin: '0 auto' }}>
			<h1>РЕГИСТРАЦИЯ</h1>
			<Form
				{...formItemLayout}
				form={form}
				name='register'
				onFinish={registerHandler}
				initialValues={{ prefix: '+7' }}
				style={{ maxWidth: 600 }}
				scrollToFirstError
			>
				<Form.Item
					name='name'
					label='ФИО'
					tooltip='Введите ФИО без сокращений'
					rules={[{ required: true, message: 'Введите ФИО без сокращений!', whitespace: true }]}
				>
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Введите ФИО' />
				</Form.Item>
				<Form.Item
					name='phone'
					label='Телефон'
					rules={[{ required: true, message: 'Введите номер телефона!' }]}
				>
					<Input
						style={{}}
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						inputMode='tel'
						addonBefore={prefixSelector}
					/>
				</Form.Item>
				<Form.Item
					name='password'
					label='Пароль'
					rules={[
						{
							required: true,
							message: 'Введите пароль!',
						},
					]}
					hasFeedback
				>
					<Input.Password
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Пароль'
					/>
				</Form.Item>
				<Form.Item
					name='confirm'
					label='Подтвердите пароль'
					dependencies={['password']}
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Подтвердите пароль!',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('Введенные пароли не совпадают!'))
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>
				<Space direction='vertical'>
					<Button
						type='primary'
						onClick={() => registerUser({ name, phone, password, role })}
						htmlType='submit'
						disabled={!name.length || !phone.length || !password.length}
					>
						Зарегистрироваться
					</Button>
					<Form.Item style={{ margin: '0 auto' }}>
						<Space>
							или <Link to='/login'>Войти</Link>
						</Space>
					</Form.Item>
				</Space>
			</Form>
		</div>
	)
}
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
}

export { ScreenRegister }
