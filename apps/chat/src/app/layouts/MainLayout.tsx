import { ChatContext, ChatContextProvider, useFriends, useGifsStickersEmoji } from '@mezon/core';
import { reactionActions, selectAllChannelMeta, selectAnyUnreadChannel, selectMentionAndReplyUnreadAllClan } from '@mezon/store';

import { selectAllDirectMessageByLastSeenTimestamp, selectAllDirectMetaMessages, useAppSelector } from '@mezon/store-mobile';
import { MezonSuspense } from '@mezon/transport';
import { SubPanelName, electronBridge, removeUndefinedAndEmpty } from '@mezon/utils';
import isElectron from 'is-electron';
import debounce from 'lodash.debounce';
import { useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const GlobalEventListener = () => {
	const { handleReconnect } = useContext(ChatContext);
	const navigate = useNavigate();

	const allLastSeenChannelAllClan = useSelector(selectAllChannelMeta);
	const allNotificationReplyMentionAllClan = useSelector(selectMentionAndReplyUnreadAllClan(allLastSeenChannelAllClan));

	const allLastSeenChannelAllDirect = useSelector(selectAllDirectMetaMessages);
	const getAllDirectMessageUnread = useSelector(selectAllDirectMessageByLastSeenTimestamp(allLastSeenChannelAllDirect));
	const filterDirectUnread = removeUndefinedAndEmpty(getAllDirectMessageUnread);

	const allCountDirectUnread = useMemo(() => {
		const length = Object.keys(filterDirectUnread)
			.filter((key) => key !== 'undefined')
			.reduce((acc, key) => acc + filterDirectUnread[key].length, 0);

		return length;
	}, [filterDirectUnread]);

	const { quantityPendingRequest } = useFriends();

	const hasUnreadChannel = useAppSelector((state) => selectAnyUnreadChannel(state));

	useEffect(() => {
		const handleNavigateToPath = (_: unknown, path: string) => {
			navigate(path);
		};
		window.electron?.on('navigate-to-path', handleNavigateToPath);
		return () => {
			window.electron?.removeListener('navigate-to-path', handleNavigateToPath);
		};
	}, [navigate]);

	useEffect(() => {
		const reconnectSocket = debounce(() => {
			if (document.visibilityState === 'visible') {
				handleReconnect('Socket disconnected event, attempting to reconnect...');
			}
		}, 100);

		window.addEventListener('focus', reconnectSocket);
		window.addEventListener('online', reconnectSocket);
		return () => {
			window.removeEventListener('focus', reconnectSocket);
			window.removeEventListener('online', reconnectSocket);
		};
	}, [handleReconnect]);

	useEffect(() => {
		const notificationCount = (allNotificationReplyMentionAllClan?.length ?? 0) + allCountDirectUnread + quantityPendingRequest;
		if (isElectron()) {
			if (hasUnreadChannel && !notificationCount) {
				electronBridge?.setBadgeCount(null);
				return;
			}
			electronBridge?.setBadgeCount(notificationCount);
		} else {
			document.title = notificationCount > 0 ? `(${notificationCount}) Mezon` : 'Mezon';
		}
	}, [allNotificationReplyMentionAllClan.length, allCountDirectUnread, quantityPendingRequest, hasUnreadChannel]);

	return null;
};

const MainLayout = () => {
	const dispatch = useDispatch();
	const { setSubPanelActive } = useGifsStickersEmoji();
	const handleClickingOutside = () => {
		setSubPanelActive(SubPanelName.NONE);
		dispatch(reactionActions.setUserReactionPanelState(false));
	};
	return (
		<div
			id="main-layout"
			onClick={handleClickingOutside}
			onContextMenu={(event: React.MouseEvent) => {
				event.preventDefault();
			}}
		>
			<Outlet />
			<GlobalEventListener />
		</div>
	);
};

const MainLayoutWrapper = () => {
	return (
		<MezonSuspense>
			<ChatContextProvider>
				<MainLayout />
			</ChatContextProvider>
		</MezonSuspense>
	);
};

export default MainLayoutWrapper;
