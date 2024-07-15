import {
	MezonStoreProvider,
	accountActions,
	appActions,
	authActions,
	channelsActions,
	clansActions,
	directActions,
	emojiSuggestionActions,
	friendsActions,
	getStoreAsync,
	initStore,
	notificationActions,
	selectCurrentClan,
	selectHasInternetMobile,
	selectIsLogin,
} from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Authentication } from './Authentication';
import { APP_SCREEN } from './ScreenTypes';
import { UnAuthentication } from './UnAuthentication';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ChatContextProvider } from '@mezon/core';
import { IWithError } from '@mezon/utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import { AppState, StatusBar } from 'react-native';
import NetInfoComp from '../components/NetworkInfo';
// import SplashScreen from '../components/SplashScreen';
import {
	STORAGE_CHANNEL_CURRENT_CACHE,
	STORAGE_CLAN_ID,
	STORAGE_IS_DISABLE_LOAD_BACKGROUND,
	load,
	remove,
	save,
	setCurrentClanLoader,
	setDefaultChannelLoader,
} from '@mezon/mobile-components';
import notifee from '@notifee/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { gifsActions } from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import { delay } from 'lodash';

const RootStack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const NavigationMain = () => {
	const isLoggedIn = useSelector(selectIsLogin);
	const hasInternet = useSelector(selectHasInternetMobile);
	const { reconnect } = useMezon();
	const currentClan = useSelector(selectCurrentClan);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(appActions.setLoadingMainMobile(true));
			delay(initAppLoading, 800);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		const timer = setTimeout(async () => {
			await SplashScreen.hideAsync();
			await notifee.cancelAllNotifications();
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
		}, 200);
		const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			clearTimeout(timer);
			appStateSubscription.remove();
		};
	}, []);

	useEffect(() => {
		if (isLoggedIn && hasInternet) {
			authLoader();
		}
	}, [isLoggedIn, hasInternet]);

	const initAppLoading = async () => {
		dispatch(appActions.setLoadingMainMobile(false));
		const isFromFCM = await load(STORAGE_IS_DISABLE_LOAD_BACKGROUND);
		await mainLoader({ isFromFCM: isFromFCM?.toString() === 'true' });
	};

	const handleAppStateChange = async (state: string) => {
		if (state === 'active') {
			delay(reconnect, 1200);
			await notifee.cancelAllNotifications();
		}
		if (state === 'background') {
			await remove(STORAGE_IS_DISABLE_LOAD_BACKGROUND);
		}
	};

	const authLoader = async () => {
		const store = await getStoreAsync();
		store.dispatch(emojiSuggestionActions.fetchEmoji({ clanId: '0', noCache: false }));
		try {
			const response = await store.dispatch(authActions.refreshSession());
			if ((response as unknown as IWithError).error) {
				console.log('Session expired');
				return;
			}

			const profileResponse = await store.dispatch(accountActions.getUserProfile());

			if ((profileResponse as unknown as IWithError).error) {
				console.log('Session expired');
				return;
			}
		} catch (error) {
			console.log('Tom log  => error authLoader', error);
		}
	};

	const mainLoader = async ({ isFromFCM = false }) => {
		const store = await getStoreAsync();
		await store.dispatch(notificationActions.fetchListNotification());
		await store.dispatch(friendsActions.fetchListFriends({}));
		const clanResp = await store.dispatch(clansActions.fetchClans());
		await store.dispatch(gifsActions.fetchGifCategories());
		await store.dispatch(gifsActions.fetchGifCategoryFeatured());
		await store.dispatch(clansActions.joinClan({ clanId: '0' }));

		// If is from FCM don't join current clan
		if (!isFromFCM) {
			if (currentClan && currentClan?.clan_id) {
				save(STORAGE_CLAN_ID, currentClan?.clan_id);
				await store.dispatch(clansActions.joinClan({ clanId: currentClan?.clan_id }));
				await store.dispatch(clansActions.changeCurrentClan({ clanId: currentClan?.clan_id, noCache: true }));
				const respChannel = await store.dispatch(channelsActions.fetchChannels({ clanId: currentClan?.clan_id, noCache: true }));
				await setDefaultChannelLoader(respChannel.payload, currentClan?.clan_id);
			} else {
				await store.dispatch(directActions.fetchDirectMessage({}));
				await setCurrentClanLoader(clanResp.payload);
			}
		} else {
			await store.dispatch(directActions.fetchDirectMessage({}));
		}

		return null;
	};

	return (
		<NavigationContainer>
			<NetInfoComp />
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				{isLoggedIn ? (
					<RootStack.Group
						screenOptions={{
							gestureEnabled: false,
						}}
					>
						<RootStack.Screen name={APP_SCREEN.AUTHORIZE} component={Authentication} />
					</RootStack.Group>
				) : (
					<RootStack.Group
						screenOptions={{
							animationTypeForReplace: 'pop',
							gestureEnabled: false,
						}}
					>
						<RootStack.Screen name={APP_SCREEN.UN_AUTHORIZE} component={UnAuthentication} />
					</RootStack.Group>
				)}
			</RootStack.Navigator>
			{/*{isLoadingSplashScreen && <SplashScreen />}*/}
		</NavigationContainer>
	);
};

const CustomStatusBar = () => {
	const { themeValue, themeBasic } = useTheme();
	// eslint-disable-next-line eqeqeq
	return (
		<StatusBar animated backgroundColor={themeValue.secondary} barStyle={themeBasic == ThemeModeBase.DARK ? 'light-content' : 'dark-content'} />
	);
};

const RootNavigation = () => {
	const mezon = useMezon();
	const { store, persistor } = useMemo(() => {
		if (!mezon) {
			return { store: null, persistor: null };
		}
		return initStore(mezon, undefined);
	}, [mezon]);

	return (
		<MezonStoreProvider store={store} loading={null} persistor={persistor}>
			<CustomStatusBar />
			<ChatContextProvider>
				<NavigationMain />
			</ChatContextProvider>
		</MezonStoreProvider>
	);
};

export default RootNavigation;
