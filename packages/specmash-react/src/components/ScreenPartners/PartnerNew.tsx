import React, { useEffect, useState } from 'react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { PartnerForm } from './PartnerForm'
import { IWorkPlace } from '../../store/workPlaceStore'
import { useNavigate } from 'react-router-dom'
import { FloatButton } from 'antd'
import { CiCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export const PartnerNew = observer(() => {
	const linkTo = useNavigate()
	const { createPartner, clearPartnerData, partnerData } = store.partners
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		linkTo('/contragents')
	}
	const createPartnerSubmit = async () => {
		setLoading(true)
		const createdPartner = await createPartner(partnerData)
		if (createdPartner instanceof Error) {
			console.log(createdPartner)
			setCreateError(createdPartner.message)
			setLoading(false)
			return createdPartner
		}
		clearPartnerData()
		setCreateError('')
		setLoading(false)
		console.log(createdPartner)
		return linkTo(`/contragents/${createdPartner.id}`)
	}
	if (loading) return <p>Loading...</p>
	return (
		<>
			<PartnerForm error={updateError} loading={loading} submitHandler={createPartnerSubmit} />
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
