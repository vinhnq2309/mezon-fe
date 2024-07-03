import { Colors } from '@mezon/mobile-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Settings } from '../../../screens/settings';
import { LanguageSetting } from '../../../screens/settings/LanguageSetting';
import { ProfileSetting } from '../../../screens/settings/ProfileSetting';
import { Sharing } from '../../../screens/settings/Sharing';
import { APP_SCREEN } from '../../ScreenTypes';
import AppearanceSetting from '../../../screens/settings/AppearanceSetting';
import AppThemeSetting from '../../../screens/settings/AppearanceSetting/AppTheme';

export const SettingStacks = ({ }: any) => {
	const Stack = createStackNavigator();
	const { t } = useTranslation(['screenStack']);
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerShadowVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				headerTitleAlign: 'center',
				headerTintColor: Colors.white,
				headerBackTitleVisible: false,
				headerStyle: {
					backgroundColor: Colors.secondary,
				},
				headerTitleStyle: {
					fontWeight: "bold"
				}
			}}
		>
			<Stack.Screen
				name={APP_SCREEN.SETTINGS.HOME}
				component={Settings}
				options={{
					headerTitle: t('settingStack.settings')
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.SETTINGS.LANGUAGE}
				component={LanguageSetting}
				options={{
					headerTitle: t('settingStack.language'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.SETTINGS.PROFILE}
				component={ProfileSetting}
				options={{
					headerTitle: t('settingStack.profile'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.SETTINGS.APPEARANCE}
				component={AppearanceSetting}
				options={{
					headerTitle: t('settingStack.appearance'),
				}}
			/>


			<Stack.Screen
				name={APP_SCREEN.SETTINGS.APP_THEME}
				component={AppThemeSetting}
				options={{
					headerTitle: t('settingStack.appTheme'),
					gestureEnabled: false
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.SETTINGS.SHARING}
				component={Sharing}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};
