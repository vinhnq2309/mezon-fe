import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { APP_SCREEN } from '../ScreenTypes';
import BottomNavigator from "./BottomNavigator";
import { NotificationStacks } from "./stacks/NotificationStacks";
import { MessagesStacks } from "./stacks/MessagesStacks";
import { ServersStacks } from "./stacks/ServersStacks";
import {
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
const RootStack = createNativeStackNavigator();

export const Authentication = () => {
	const getInitialRouteName = APP_SCREEN.BOTTOM_BAR;

	return (
		<BottomSheetModalProvider>
			<RootStack.Navigator
				initialRouteName={getInitialRouteName}
				screenOptions={{ headerShown: false, gestureEnabled: true }}>

				<RootStack.Screen
					name={APP_SCREEN.BOTTOM_BAR}
					component={BottomNavigator}
					options={{ gestureEnabled: false }}
				/>
				<RootStack.Screen
					name={APP_SCREEN.SERVERS.STACK}
					children={props => (
						<ServersStacks {...props} />
					)}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<RootStack.Screen
					name={APP_SCREEN.MESSAGES.STACK}
					children={props => (
						<MessagesStacks {...props} />
					)}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<RootStack.Screen
					name={APP_SCREEN.NOTIFICATION.STACK}
					children={props => (
						<NotificationStacks {...props} />
					)}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
			</RootStack.Navigator>
		</BottomSheetModalProvider>
	);
};
