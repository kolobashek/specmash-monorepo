import { makeAutoObservable } from 'mobx'

class UIStore {
	drawerOpened = false
	headerTitle?: string
	headerContent?: string

	constructor() {
		makeAutoObservable(this)
	}
	showDrawer = () => {
		this.drawerOpened = true
	}
	hideDrawer = () => {
		this.drawerOpened = false
	}
	setHeaderTitle = (headerTitle: string) => {
		this.headerTitle = headerTitle
	}
	setHeaderContent = (content: string) => {
		this.headerContent = content
	}
	deleteHeaderTitle = () => {
		this.headerTitle = undefined
	}
}

export default new UIStore()
