import { useEscapeKeyClose, useOnClickOutside } from '@mezon/core';
import {
	channelMetaActions,
	channelsActions,
	clansActions,
	notificationActions,
	selectAllChannelLastSeenTimestampByClanId,
	selectAllNotificationExcludeMentionAndReply,
	selectAllNotificationMentionAndReply,
	selectCurrentClan,
	selectMentionAndReplyUnreadByClanId,
	selectTheme,
	useAppDispatch
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { INotification, NotificationEntity, sortNotificationsByDate } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import EmptyNotification from './EmptyNotification';
import NotificationChannel from './NotificationChannel';
import NotificationItem from './NotificationItem';

export type MemberListProps = { className?: string };

export type NotificationProps = {
	rootRef?: RefObject<HTMLElement>;
};

const InboxType = {
	INDIVIDUAL: 'individual',
	UNREADS: 'unreads',
	MENTIONS: 'mentions'
};

const tabDataNotify = [
	{ title: 'For you', value: InboxType.INDIVIDUAL },
	{ title: 'Unreads', value: InboxType.UNREADS },
	{ title: 'Mentions', value: InboxType.MENTIONS }
];

type ListCreatimeMessage = {
	channelId: string;
	messageId: string;
	createdTime: number;
};

const createMessageArray = (unReadReplyAndMentionListArr: NotificationEntity[]): ListCreatimeMessage[] => {
	const sortedMessages = unReadReplyAndMentionListArr
		.filter((noti) => noti.create_time)
		.sort((a, b) => {
			const dateA = new Date(a.create_time!).getTime();
			const dateB = new Date(b.create_time!).getTime();
			return dateB - dateA;
		});

	const notis = sortedMessages.map((noti) => ({
		channelId: noti.content.channel_id,
		messageId: noti.content.message_id,
		createdTime: new Date(noti.create_time!).getTime()
	}));

	return notis;
};

const getMessageLastest = (listCreatimeMessage: ListCreatimeMessage[]) => {
	const channelMap = new Map<string, { channelId: string; messageId: string; createdTime: number }>();
	listCreatimeMessage.forEach((createdTime) => {
		const existingMessage = channelMap.get(createdTime.channelId);
		if (!existingMessage || createdTime.createdTime > existingMessage.createdTime) {
			channelMap.set(createdTime.channelId, createdTime);
		}
	});
	return Array.from(channelMap.values());
};

function NotificationList({ rootRef }: NotificationProps) {
	const currentClan = useSelector(selectCurrentClan);
	const allLastSeenChannelAllChannelInClan = useSelector(selectAllChannelLastSeenTimestampByClanId(currentClan?.clan_id ?? ''));
	const unReadReplyAndMentionList = useSelector(selectMentionAndReplyUnreadByClanId(allLastSeenChannelAllChannelInClan));
	const dispatch = useAppDispatch();

	const [currentTabNotify, setCurrentTabNotify] = useState(InboxType.MENTIONS);
	const handleChangeTab = (valueTab: string) => {
		setCurrentTabNotify(valueTab);
	};

	const getNotificationExcludeMentionAndReplyUnread = useSelector(selectAllNotificationExcludeMentionAndReply);
	const getAllNotificationMentionAndReply = useSelector(selectAllNotificationMentionAndReply);

	const getExcludeMentionAndReply = useMemo(() => {
		return sortNotificationsByDate(getNotificationExcludeMentionAndReplyUnread);
	}, [getNotificationExcludeMentionAndReplyUnread]);

	const getMentionAndReplyUnread = useMemo(() => {
		return sortNotificationsByDate(unReadReplyAndMentionList);
	}, [unReadReplyAndMentionList]);

	const getAllMentionAndReply = useMemo(() => {
		return sortNotificationsByDate(getAllNotificationMentionAndReply);
	}, [getAllNotificationMentionAndReply]);

	const appearanceTheme = useSelector(selectTheme);

	const getListCreatedTime = useMemo(() => {
		return createMessageArray(unReadReplyAndMentionList);
	}, [unReadReplyAndMentionList]);

	const getLastestMessage = useMemo(() => {
		return getMessageLastest(getListCreatedTime);
	}, [getListCreatedTime]);

	const handleMarkAllAsRead = useCallback(() => {
		const timestamp = Date.now() / 1000;
		getLastestMessage.forEach((list: ListCreatimeMessage) => {
			dispatch(channelMetaActions.setChannelLastSeenTimestamp({ channelId: list.channelId, timestamp }));
			// dispatch(
			// 	messagesActions.updateLastSeenMessage({
			// 		clanId: currentClan?.clan_id ?? '',
			// 		channelId: list.channelId ?? '',
			// 		messageId: list.messageId ?? ''
			// 	})
			// );
			dispatch(channelsActions.updateChannelBadgeCount({ channelId: list.channelId ?? '', count: 0, isReset: true }));
		});
		if (currentClan?.badge_count && currentClan?.badge_count > 0) {
			dispatch(clansActions.updateClanBadgeCount({ clanId: currentClan?.clan_id ?? '', count: currentClan?.badge_count * -1 }));
		}
	}, [getLastestMessage, dispatch, currentClan?.badge_count]);

	const isShowMarkAllAsRead = useMemo(() => {
		return unReadReplyAndMentionList.length > 0 && currentTabNotify === InboxType.UNREADS;
	}, [unReadReplyAndMentionList, currentTabNotify]);

	const modalRef = useRef<HTMLDivElement>(null);
	const handleHideInbox = useCallback(() => {
		dispatch(notificationActions.setIsShowInbox(false));
	}, []);

	useEscapeKeyClose(modalRef, handleHideInbox);
	useOnClickOutside(modalRef, handleHideInbox, rootRef);

	return (
		<div
			ref={modalRef}
			tabIndex={-1}
			className="absolute top-8 right-0 z-[99999999] rounded-lg dark:shadow-shadowBorder shadow-shadowInbox w-[480px]"
		>
			<div className="flex flex-col dark:bg-bgPrimary bg-white border-borderDefault dark:text-contentSecondary text-black text-[14px] rounded-lg w-1/2 min-w-[480px] max-w-[600px] z-50 overflow-hidden">
				<div className="py-2 px-3 dark:bg-[#2B2D31] bg-[#F2F3F5]">
					<div className="flex flex-row items-center justify-between gap-2 font-bold text-[16px]">
						<div className="flex flex-row items-center justify-start">
							<InboxButton />
							<div>Inbox </div>
						</div>

						{isShowMarkAllAsRead && (
							<Tooltip
								content={
									<p style={{ whiteSpace: 'nowrap' }} className="max-w-60 truncate">
										{'Mark all as read'}
									</p>
								}
								trigger="hover"
								animation="duration-500"
								style={appearanceTheme === 'light' ? 'light' : 'dark'}
								placement="top"
							>
								<button
									onClick={handleMarkAllAsRead}
									className="flex items-center p-1 rounded-sm justify-center dark:bg-bgTertiary bg-bgLightModeButton"
								>
									<Icons.MarkAllAsRead className="w-5 h-5" />
								</button>{' '}
							</Tooltip>
						)}
					</div>
					<div className="flex flex-row border-b-[1px] border-b-gray-300">
						<div className="flex flex-row gap-4 py-3 w-[70%]">
							{tabDataNotify.map((tab, index: number) => {
								return (
									<div key={index}>
										<button
											className={`px-2 py-[4px] rounded-[4px] text-base font-medium ${currentTabNotify === tab.value ? 'dark:bg-bgTertiary bg-bgLightModeButton dark:text-contentPrimary text-colorTextLightMode' : ''}`}
											tabIndex={index}
											onClick={() => handleChangeTab(tab.value)}
										>
											{tab.title}
										</button>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div
					className={`dark:bg-bgSecondary bg-bgLightSecondary flex flex-col max-w-[600px] max-h-heightInBox overflow-y-auto overflow-x-hidden ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
				>
					{currentTabNotify === InboxType.INDIVIDUAL && (
						<div>
							{getExcludeMentionAndReply.length > 0 ? (
								getExcludeMentionAndReply.map((notify, index) => (
									<NotificationItem notify={notify} key={`individual-${notify?.id}-${index}`} />
								))
							) : (
								<EmptyNotification isEmptyForYou />
							)}
						</div>
					)}

					{currentTabNotify === InboxType.UNREADS && (
						<div>
							{getMentionAndReplyUnread.length > 0 ? (
								<NotificationChannel isUnreadTab={true} unreadListConverted={getMentionAndReplyUnread} />
							) : (
								<EmptyNotification isEmptyUnread />
							)}
						</div>
					)}

					{currentTabNotify === InboxType.MENTIONS && (
						<div>
							{getAllMentionAndReply.length > 0 ? (
								getAllMentionAndReply.map((notification: INotification, index: number) => (
									<NotificationChannel
										key={`mention-${notification?.id}-${index}`}
										isUnreadTab={false}
										unreadListConverted={[]}
										notification={notification}
									/>
								))
							) : (
								<EmptyNotification isEmptyMentions />
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default NotificationList;

function InboxButton() {
	return (
		<div>
			<Icons.Inbox />
		</div>
	);
}
