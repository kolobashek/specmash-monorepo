import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Avatar, Button, FloatButton, List } from 'antd'
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons'

export const PartnersList = observer(() => {
	const navigate = useNavigate()
	const { list, partnerData, createPartner, clearPartnerData, getPartners } = store.partners
	useEffect(() => {
		const start = async () => {
			try {
				setLoading(true)
				await getPartners()
				setLoading(false)
			} catch (error) {
				setLoading(false)
				console.log(error)
			}
		}
		start()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const addPartnerSubmit = async () => {
		setLoading(true)
		const newDriver = await createPartner(partnerData)
		if (newDriver instanceof Error) {
			console.log(newDriver)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearPartnerData()
		getPartners()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	if (loading) return <div>Loading...</div>
	return (
		<>
			<List>
				<div>
					<List
						dataSource={list}
						bordered
						renderItem={(partner) => (
							<Link to={`/contragents/${partner.id}`} key={partner.id}>
								<List.Item>
									<Avatar size='small' icon={<UserOutlined />} />
									<p>{partner.name}</p>
									<p>{partner.address}</p>
									<p>{partner.contacts}</p>
								</List.Item>
							</Link>
						)}
					/>
					{!visibleAddButton && (
						<>
							<div>
								<Button
									// style={styles.row}
									color={'green'}
									disabled={!partnerData.name || loading}
									onClick={addPartnerSubmit}
									loading={loading}
								/>
								<Button color={'red'} onClick={cancelHandler} disabled={loading} />
							</div>
						</>
					)}
				</div>
			</List>
			<FloatButton
				onClick={() => navigate('/contragents/new')}
				icon={<PlusCircleOutlined />}
				tooltip='Добавить контрагента'
			/>
			<Outlet />
		</>
	)
})
