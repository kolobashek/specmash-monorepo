import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FloatButton, Card, List, Typography } from 'antd'
import store from '../../store'
import { observer } from 'mobx-react-lite'

import { localizedRoleName } from '../../utils'
import { IPartner } from '../../store/partnerStore'

export const PartnerCard = observer(() => {
	const navigate = useNavigate()
	const { id } = useParams()
	const { Text } = Typography
	const {
		// currentPartner,
		// setCurrentPartner,
		getPartnerById,
		getPartners,
		updatePartner,
		clearPartnerData,
		setPartnerData,
		partnerData,
	} = store.partners
	const partnerId = Number(id)
	useEffect(() => {
		const partner = async () => {
			const input = await getPartnerById(partnerId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setPartnerData(input)
		}
		partner()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editPartnerHandler = () => {
		navigate(`/workplaces/contragents/${partnerId}/edit`)
	}
	const editPartnerSubmit = async (id: number) => {
		setLoading(true)
		const newPartner = await updatePartner({ id, ...partnerData })
		if (newPartner instanceof Error) {
			console.log(newPartner)
			setUpdateError(newPartner.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		// setCurrentPartner(newPartner)
		setVisibleEditButton(true)
		setLoading(false)
		clearPartnerData()
		return newPartner
	}
	if (!partnerData) return <p>Что-то пошло не так.</p>
	return (
		<>
			<Card title={`${partnerData.name}`}>
				<p>
					<Text>Адрес:</Text>
					<Text>{`${partnerData.address ? partnerData.address : ''}`}</Text>
				</p>
			</Card>
			{/* <FloatButton
				visible={visibleEditButton}
				onPress={editPartnerHandler}
				placement='right'
				color='green'
			/> */}
		</>
	)
})

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
