export const localizedRoleName = (role: string | undefined) => {
	if (role === 'admin') return 'Администратор'
	if (role === 'manager') return 'Менеджер'
	if (role === 'driver') return 'Водитель'
	return null
}
