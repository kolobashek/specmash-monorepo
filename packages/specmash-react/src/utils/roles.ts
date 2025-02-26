export const localizedRoleName = (role: string | number) => {
	if (role === ('admin' || 1)) return 'Администратор'
	if (role === ('manager' || 2)) return 'Менеджер'
	if (role === ('driver' || 3)) return 'Водитель'
	return null
}
