import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
	titles: {
		key: string
		label: string
	}[]
}

const StickyHeader: React.FC<Props> = ({ titles }) => {
	return (
		<View style={styles.table}>
			<View style={styles.row}>
				{titles.map((col) => (
					<Text key={col.key} style={[styles.cellHeader, styles.cell]}>
						{col.label}
					</Text>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	table: {
		flex: 1,
		paddingHorizontal: 16, // добавили горизонтальный padding
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		borderBottomWidth: 2, // увеличили толщину линии для заголовка
	},
	cell: {
		flex: 1,
		padding: 10,
		textAlign: 'left', // выравнивание по центру
	},
	cellHeader: {
		padding: 10,
		fontWeight: 'bold', // жирный шрифт
		textAlign: 'left',
	},
})

export { StickyHeader }
