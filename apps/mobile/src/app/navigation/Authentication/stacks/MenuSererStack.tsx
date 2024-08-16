import { Fonts, useTheme } from '@mezon/mobile-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import CategoryCreator from '../../../components/Category';
import ChannelCreator from '../../../components/ChannelCreator';
import ClanNotificationSetting from '../../../components/ClanNotificationSetting';
import NotificationOverrides from '../../../components/ClanNotificationSetting/NotificationOverrides';
import NotificationSettingDetail from '../../../components/ClanNotificationSetting/NotificationSettingDetail';
import ClanSetting from '../../../components/ClanSettings';
import MemberSetting from '../../../components/ClanSettings/Member';
import ClanOverviewSetting from '../../../components/ClanSettings/Overview';
import StickerSetting from '../../../components/ClanSettings/Sticker';
import EventCreatorDetails from '../../../components/EventCreator/EventCreatorDetails';
import EventCreatorPreview from '../../../components/EventCreator/EventCreatorPreview';
import EventCreatorType from '../../../components/EventCreator/EventCreatorType';
import { CreateNewRole } from '../../../screens/serverRoles/CreateNewRole';
import { RoleDetail } from '../../../screens/serverRoles/RoleDetail';
import { ServerRoles } from '../../../screens/serverRoles/ServerRoles';
import { SetupMembers } from '../../../screens/serverRoles/SetupMembers';
import { SetupPermissions } from '../../../screens/serverRoles/SetupPermissions';
import { APP_SCREEN } from '../../ScreenTypes';

export const MenuClanStacks = ({ }: any) => {
	const { themeValue } = useTheme();
	const Stack = createStackNavigator();
	const { t } = useTranslation(['screenStack']);

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerShadowVisible: false,
				headerBackTitleVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				headerTitleAlign: 'center',
				headerTintColor: themeValue.white,
				headerStyle: {
					backgroundColor: themeValue.secondary,
				},
				headerTitleStyle: {
					fontSize: Fonts.size.h6,
					fontWeight: 'bold',
					color: themeValue.textStrong,
				},
				cardStyle: {
					backgroundColor: 'transparent',
				},
			}}
		>
			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_CATEGORY}
				component={CategoryCreator}
				options={{
					headerTitle: t('menuClanStack.categoryCreator'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_CHANNEL}
				component={ChannelCreator}
				options={{
					headerTitle: t('menuClanStack.channelCreator'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT}
				component={EventCreatorType}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT_DETAILS}
				component={EventCreatorDetails}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT_PREVIEW}
				component={EventCreatorPreview}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.SETTINGS}
				component={ClanSetting}
				options={{
					headerTitle: t('menuClanStack.clanSetting'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.OVERVIEW_SETTING}
				component={ClanOverviewSetting}
				options={{
					headerTitle: t('menuClanStack.clanOverviewSetting'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.STICKER_SETTING}
				component={StickerSetting}
				options={{
					headerTitle: t('menuClanStack.sticker'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.MEMBER_SETTING}
				component={MemberSetting}
				options={{
					headerTitle: t('menuClanStack.member'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.ROLE_SETTING}
				component={ServerRoles}
				options={{
					headerTitle: t('menuClanStack.serverRoles'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_NEW_ROLE}
				component={CreateNewRole}
				options={{
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.SETUP_PERMISSIONS}
				component={SetupPermissions}
				options={{
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.SETUP_ROLE_MEMBERS}
				component={SetupMembers}
				options={{
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.ROLE_DETAIL}
				component={RoleDetail}
				options={{
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.NOTIFICATION_SETTING}
				component={ClanNotificationSetting}
				options={{
					headerTitle: t('menuClanStack.notificationSetting'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.NOTIFICATION_OVERRIDES}
				component={NotificationOverrides}
				options={{
					headerTitle: t('menuClanStack.newOverride'),
				}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.NOTIFICATION_SETTING_DETAIL}
				component={NotificationSettingDetail}
				options={{
					headerTitle: t('menuClanStack.notificationSetting'),
				}}
			/>
		</Stack.Navigator>
	);
};
