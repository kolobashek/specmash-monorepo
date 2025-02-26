module.exports = ({ config }) => {
	console.log(config.name) // выводит 'My App'
	return {
		...config,
	}
}
