export const localizedRoleName = (role: string | number) => {
	if (role === 'admin' || role === 1) return 'Администратор'
	if (role === 'manager' || role === 2) return 'Менеджер'
	if (role === 'driver' || role === 3) return 'Водитель'
	return null
}
