import React, { useEffect, useState } from 'react'
// import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'
import {
	NavigationContainer,
	LinkingOptions,
	NavigatorScreenParams,
} from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	ShiftScreen,
	InfoScreen,
	ContrAgentsList,
	UsersList,
	ContrAgentCard,
	MachinesList,
	MachineCard,
	MachineEdit,
	MachineNew,
	ScheduleScreen,
	ContrAgentEdit,
	ContrAgentNew,
} from './src/components'
import { UserCard, UserEdit, UserNew } from './src/components/UsersScreen'
// import * as Device from 'expo-device'
import { ObjectCard, ObjectsList } from './src/components/ObjectsScreen'
import { ObjectEdit } from './src/components/ObjectsScreen/ObjectEdit'
import { ObjectNew } from './src/components/ObjectsScreen/ObjectNew'
import { ShiftNew } from './src/components/TableScreen/ShiftNew'
import { ShiftEdit } from './src/components/TableScreen/ShiftEdit'
import { ShiftCard } from './src/components/TableScreen/ShiftCard'

const Stack = createStackNavigator<RootStackParamList>()
const AuthStack = createStackNavigator<AuthStackParamList>()
const Drawer = createDrawerNavigator<HomeDrawerParamList>()
const UsersStack = createStackNavigator<UsersStackParamList>()
const ContrAgentsStack = createStackNavigator<ContrAgentsStackParamList>()
const ObjectStack = createStackNavigator<ObjectStackParamList>()
const ObjectsTab = createBottomTabNavigator<WorkPlacesTabParamList>()
const MachinesStack = createStackNavigator<MachinesStackParamList>()
const ShiftStack = createStackNavigator<ShiftStackParamList>()
const prefix = Linking.createURL('/')

const REGISTER_SCREEN = 'register'
const LOGIN_SCREEN = 'login'
const INFO_SCREEN = 'info'
const CONTRAGENTS_SCREEN = 'contragents'
const SHIFTS_SCREEN = 'shifts'
const MACHINES_SCREEN = 'machines'
const USERS_SCREEN = 'users'
const WORK_PLACES_SCREEN = 'workplaces'
const OBJECTS_SCREEN = 'objects'
const AUTH_SCREEN = 'auth'
const SCHEDULE_SCREEN = 'schedule'

const App = observer(() => {
	const url = Linking.useURL()
	const pathname = null
	const [loading, setLoading] = useState(false)
	const linking: LinkingOptions<RootStackParamList> = {
		prefixes: [prefix],
		config: {
			screens: {
				Спецмаш: {
					initialRouteName:
						pathname ===
						(MACHINES_SCREEN ||
							INFO_SCREEN ||
							CONTRAGENTS_SCREEN ||
							SHIFTS_SCREEN ||
							USERS_SCREEN ||
							WORK_PLACES_SCREEN ||
							MACHINES_SCREEN)
							? pathname
							: SHIFTS_SCREEN,
					path: '/',
					screens: {
						shifts: {
							path: SHIFTS_SCREEN,
							screens: {
								ShiftScreen: '',
								ShiftNew: 'new',
								ShiftDetails: {
									path: '/:id',
								},
								ShiftEdit: {
									path: '/:id/edit',
								},
							},
						},
						machines: {
							path: MACHINES_SCREEN,
							screens: {
								MachinesList: '',
								MachineNew: 'new',
								MachineDetails: {
									path: '/:id',
								},
								MachineEdit: {
									path: '/:id/edit',
								},
							},
						},
						users: {
							path: USERS_SCREEN,
							screens: {
								UsersList: '',
								UserNew: 'new',
								UserDetails: {
									path: '/:id',
								},
								UserEdit: {
									path: '/:id/edit',
								},
							},
						},
						workplaces: {
							path: WORK_PLACES_SCREEN,
							screens: {
								contragents: {
									path: CONTRAGENTS_SCREEN,
									screens: {
										ContrAgentsList: '',
										ContrAgentNew: 'new',
										ContrAgentDetails: {
											path: '/:id',
										},
										ContrAgentEdit: {
											path: '/:id/edit',
										},
									},
								},
								objects: {
									path: OBJECTS_SCREEN,
									screens: {
										ObjectsList: '',
										ObjectNew: 'new',
										ObjectDetails: {
											path: '/:id',
										},
										ObjectEdit: {
											path: '/:id/edit',
										},
									},
								},
							},
						},
						schedule: SCHEDULE_SCREEN,
						info: 'info',
					},
				},
				AuthStack: {
					path: AUTH_SCREEN,
					screens: {
						login: LOGIN_SCREEN,
						register: REGISTER_SCREEN,
					},
				},
			},
		},
	}
	const { userAuthorized, getUserByAsyncStorage } = store.auth
	useEffect(() => {
		if (!userAuthorized) {
			setLoading(true)
			getUserByAsyncStorage()
			setLoading(false)
		}
	}, [])
	if (loading) {
		return (
			<View style={styles.fullContainer}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		)
	}
	return (
		<SafeAreaProvider>
			<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{!userAuthorized ? (
						<Stack.Screen name='AuthStack' component={Auth} />
					) : (
						<Stack.Screen name='Спецмаш' component={Home} />
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
})

const Home = observer(() => {
	const { hasRoles } = store.auth
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name={SHIFTS_SCREEN}
				component={Shifts}
				options={{ drawerLabel: 'Путевые', title: 'Путевые' }}
			/>
			{hasRoles('admin', 'manager') && (
				<Drawer.Screen
					name={MACHINES_SCREEN}
					component={Machines}
					options={{ drawerLabel: 'Техника', title: 'Техника' }}
				/>
			)}
			{hasRoles('admin', 'manager') && (
				<Drawer.Screen
					name={USERS_SCREEN}
					component={Users}
					options={{ drawerLabel: 'Водители', title: 'Водители' }}
				/>
			)}
			{hasRoles('admin', 'manager') && (
				<Drawer.Screen
					name={WORK_PLACES_SCREEN}
					component={WorkPlaces}
					options={{ drawerLabel: 'Объекты', title: 'Объекты' }}
				/>
			)}
			{hasRoles('driver') && (
				<Drawer.Screen
					name={SCHEDULE_SCREEN}
					component={ScheduleScreen}
					options={{ drawerLabel: 'График', title: 'График' }}
				/>
			)}
			<Drawer.Screen
				name={INFO_SCREEN}
				component={InfoScreen}
				options={{ drawerLabel: 'Info', title: 'Info' }}
			/>
		</Drawer.Navigator>
	)
})
const Auth = () => {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
			<AuthStack.Screen
				name={REGISTER_SCREEN}
				component={RegisterScreen}
				options={{ headerShown: false }}
			/>
		</AuthStack.Navigator>
	)
}
const Users = () => {
	return (
		<UsersStack.Navigator>
			<UsersStack.Screen name='UsersList' component={UsersList} options={{ headerShown: false }} />
			<UsersStack.Screen name='UserDetails' component={UserCard} options={{ headerShown: false }} />
			<UsersStack.Screen name='UserEdit' component={UserEdit} options={{ headerShown: false }} />
			<UsersStack.Screen name='UserNew' component={UserNew} options={{ headerShown: false }} />
		</UsersStack.Navigator>
	)
}
const ContrAgents = () => {
	return (
		<ContrAgentsStack.Navigator>
			<ContrAgentsStack.Screen
				name='ContrAgentsList'
				component={ContrAgentsList}
				options={{ headerShown: false }}
			/>
			<ContrAgentsStack.Screen
				name='ContrAgentDetails'
				component={ContrAgentCard}
				options={{ headerShown: false }}
			/>
			<ContrAgentsStack.Screen
				name='ContrAgentEdit'
				component={ContrAgentEdit}
				options={{ headerShown: false }}
			/>
			<ContrAgentsStack.Screen
				name='ContrAgentNew'
				component={ContrAgentNew}
				options={{ headerShown: false }}
			/>
		</ContrAgentsStack.Navigator>
	)
}
const Objects = () => {
	return (
		<ObjectStack.Navigator>
			<ObjectStack.Screen
				name='ObjectsList'
				component={ObjectsList}
				options={{ headerShown: false }}
			/>
			<ObjectStack.Screen
				name='ObjectDetails'
				component={ObjectCard}
				options={{ headerShown: false }}
			/>
			<ObjectStack.Screen
				name='ObjectEdit'
				component={ObjectEdit}
				options={{ headerShown: false }}
			/>
			<ObjectStack.Screen name='ObjectNew' component={ObjectNew} options={{ headerShown: false }} />
		</ObjectStack.Navigator>
	)
}
const WorkPlaces = () => {
	return (
		<ObjectsTab.Navigator>
			<ObjectsTab.Screen
				name={OBJECTS_SCREEN}
				component={Objects}
				options={{ headerShown: false }}
			/>
			<ObjectsTab.Screen
				name={CONTRAGENTS_SCREEN}
				component={ContrAgents}
				options={{ headerShown: false }}
			/>
		</ObjectsTab.Navigator>
	)
}
const Machines = () => {
	return (
		<MachinesStack.Navigator>
			<MachinesStack.Screen
				name='MachinesList'
				component={MachinesList}
				options={{ headerShown: false }}
			/>
			<MachinesStack.Screen
				name='MachineDetails'
				component={MachineCard}
				options={{ headerShown: false }}
			/>
			<MachinesStack.Screen
				name='MachineEdit'
				component={MachineEdit}
				options={{ headerShown: false }}
			/>
			<MachinesStack.Screen
				name='MachineNew'
				component={MachineNew}
				options={{ headerShown: false }}
			/>
		</MachinesStack.Navigator>
	)
}
const Shifts = () => {
	return (
		<ShiftStack.Navigator>
			<ShiftStack.Screen
				name='ShiftScreen'
				component={ShiftScreen}
				options={{ headerShown: false }}
			/>
			<ShiftStack.Screen
				name='ShiftDetails'
				component={ShiftCard}
				options={{ headerShown: false }}
			/>
			<ShiftStack.Screen name='ShiftEdit' component={ShiftEdit} options={{ headerShown: false }} />
			<ShiftStack.Screen name='ShiftNew' component={ShiftNew} options={{ headerShown: false }} />
		</ShiftStack.Navigator>
	)
}

export default App

export type RootStackParamList = {
	Спецмаш: NavigatorScreenParams<HomeDrawerParamList>
	AuthStack: NavigatorScreenParams<AuthStackParamList>
}
export type HomeDrawerParamList = {
	shifts: undefined
	machines: NavigatorScreenParams<MachinesStackParamList>
	users: NavigatorScreenParams<UsersStackParamList>
	workplaces: NavigatorScreenParams<WorkPlacesTabParamList>
	schedule: undefined
	info: undefined
}
export type UsersStackParamList = {
	UsersList: undefined
	UserDetails: { id: string }
	UserEdit: { id: string }
	UserNew: undefined
}
export type ContrAgentsStackParamList = {
	ContrAgentsList: undefined
	ContrAgentDetails: { id: string }
	ContrAgentEdit: { id: string }
	ContrAgentNew: undefined
}
export type ObjectStackParamList = {
	ObjectsList: undefined
	ObjectDetails: { id: string }
	ObjectEdit: { id: string }
	ObjectNew: undefined
}
export type MachinesStackParamList = {
	MachinesList: undefined
	MachineDetails: { id: string }
	MachineEdit: { id: string }
	MachineNew: undefined
}
export type WorkPlacesTabParamList = {
	objects: NavigatorScreenParams<ObjectStackParamList>
	contragents: NavigatorScreenParams<ContrAgentsStackParamList>
}
export type ShiftStackParamList = {
	ShiftScreen: undefined
	ShiftDetails: { id: string }
	ShiftEdit: { id: string }
	ShiftNew: undefined
}
type AuthStackParamList = {
	login: undefined
	register: undefined
}

const styles = StyleSheet.create({
	fullContainer: {
		flex: 1,
		justifyContent: 'center',
	},
})
