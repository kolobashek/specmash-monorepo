import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { Input, Space, Typography, Flex, Row, Col, Button } from 'antd'
import _ from 'lodash'
import { MenuOutlined } from '@ant-design/icons'

const Text = Typography.Text

const DefaultHeaderContent = observer(() => {
	const { users, uiStore } = store
	const { headerContent } = uiStore
	const { usersFilter, setUserFilter } = users
	const [searchText, setSearchText] = useState('')
	useEffect(() => {
		if (headerContent === 'userSearch') {
			usersFilter.search && setSearchText(usersFilter.search)
		}
	}, [])
	const debounced = useRef(_.debounce((text) => setUserFilter({ search: text }), 800))
	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		debounced.current.cancel()
		const text = e.currentTarget.value
		setSearchText(text)
		debounced.current(text)
	}
	switch (headerContent) {
		case 'userSearch':
			return (
				<Flex align='center' justify='flex-end' style={{ height: '100%' }}>
					<Input
						value={searchText}
						placeholder='Начните ввод'
						allowClear
						onChange={onSearch}
						style={{ width: 304 }}
					/>
				</Flex>
			)

		default:
			return (
				<Space>
					<Text>Спецмаш</Text>
				</Space>
			)
	}
})

export const HeaderContent = observer(() => {
	const { showDrawer } = store.uiStore
	return (
		<Row>
			<Col span={2}>
				<Button type='text' size='large' onClick={showDrawer}>
					<MenuOutlined style={{ color: 'white' }} />
				</Button>
			</Col>
			<Col span={22}>
				<DefaultHeaderContent />
			</Col>
		</Row>
	)
})
