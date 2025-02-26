import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { IShift, localPrkDate } from '../../../store/shiftsStore'
import { observer } from 'mobx-react-lite'
import store from '../../../store'

export interface ITableParams {
	pagination?: TablePaginationConfig
	sortField?: string
	sortOrder?: string
	filters?: Record<string, FilterValue | null>
}

const columns: ColumnsType<IShift> = [
	{
		title: 'Дата',
		dataIndex: 'date',
		sorter: true,
		filters: [
			{ text: '2020-01-01', value: '2020-01-01' },
			{ text: '2020-01-02', value: '2020-01-02' },
		],
		render: (date) => {
			const normalDate = localPrkDate.msToDateString(Number(date))
			return `${normalDate || '--'}`
		},
		// width: '20%',
	},
	{
		title: '№ смены',
		dataIndex: 'shiftNumber',
		filters: [
			{ text: '1', value: 1 },
			{ text: '2', value: 2 },
		],
		width: 30,
	},
	{
		title: 'Водитель',
		dataIndex: 'driver',
		render: (driver) => {
			return `${driver?.name || '-'}`
		},
		// width: '20%',
	},
	{
		title: 'Машина',
		dataIndex: 'equipment',
		render: (equipment) => {
			return `${equipment?.name || '-'}`
		},
		// width: '20%',
	},
	{
		title: 'Время',
		dataIndex: 'hoursWorked',
		sorter: true,
	},
	{
		title: 'Объект',
		dataIndex: 'workPlace',
		render: (workPlace) => `${workPlace.name || '-'}`,
	},
	{
		title: 'Комментарий',
		dataIndex: 'comment',
		// width: '40%',
	},
]

const ShiftsList: React.FC = observer(() => {
	const { getShiftsFromApi } = store.shifts
	const [data, setData] = useState<IShift[]>()
	const [loading, setLoading] = useState(false)
	const [tableParams, setTableParams] = useState<ITableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	})

	const fetchData = async () => {
		setLoading(true)
		const shifts = await getShiftsFromApi()
		// console.log(shifts)
		if (shifts instanceof Error) {
			return
		}
		setData(shifts)
		// fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
		// 	.then((res) => res.json())
		// 	.then(({ results }) => {
		// 		setData(results)
		setLoading(false)
		setTableParams({
			...tableParams,
			pagination: {
				...tableParams.pagination,
				total: shifts.length,
				// 200 is mock data, you should read it from server
				// total: data.totalCount,
			},
		})
		// 	})
	}

	useEffect(() => {
		fetchData()
	}, [JSON.stringify(tableParams)])

	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<IShift> | SorterResult<IShift>[]
	) => {
		setTableParams({
			pagination,
			filters,
			...sorter,
		})
		if (pagination.pageSize !== tableParams.pagination?.pageSize) {
			setData([])
		}
	}

	return (
		<Table
			columns={columns}
			rowKey={(shift) => shift.id}
			dataSource={data}
			pagination={tableParams.pagination}
			loading={loading}
			onChange={handleTableChange}
		/>
	)
})

export { ShiftsList }
