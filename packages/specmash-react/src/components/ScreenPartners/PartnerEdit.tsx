import React, { useEffect, useState } from 'react'
import store from '../../store'
import { useNavigate, useParams } from 'react-router-dom'
import { FloatButton } from 'antd'
import { observer } from 'mobx-react-lite'
import { PartnerForm } from './PartnerForm'

export const PartnerEdit = observer(() => {
	const navigate = useNavigate()
	const { id } = useParams()
	const partnerId = Number(id)
	const { updatePartner, partnerData } = store.partners
	const [loading, setLoading] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const updatePartnerSubmit = async () => {
		setLoading(true)
		const updatedPartner = await updatePartner({ id: partnerId, ...partnerData })
		if (updatedPartner instanceof Error) {
			console.log(updatedPartner)
			setUpdateError(updatedPartner.message)
			setLoading(false)
			return updatedPartner
		}
		setUpdateError('')
		// setCurrentPartner(updatedPartner)
		setLoading(false)
		return navigate(`/workplaces/contragents/${updatedPartner.id}`)
	}
	const cancelHandler = () => {
		navigate(`/workplaces/contragents/${partnerId}`)
	}
	if (loading) return <p>Loading...</p>
	return (
		<>
			<PartnerForm
				partnerId={partnerId}
				error={updateError}
				loading={loading}
				submitHandler={updatePartnerSubmit}
			/>
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
