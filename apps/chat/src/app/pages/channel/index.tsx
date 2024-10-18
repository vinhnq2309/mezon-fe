import { Canvas, FileUploadByDnD, MemberList, SearchMessageChannelRender, TooManyUpload } from '@mezon/components';
import { useDragAndDrop, usePermissionChecker, useSearchMessages, useThreads, useWindowFocusState } from '@mezon/core';
import {
	channelMetaActions,
	channelsActions,
	clansActions,
	selectAnyUnreadChannels,
	selectAppChannelById,
	selectChannelById,
	selectCloseMenu,
	selectCurrentChannel,
	selectFetchChannelStatus,
	selectIsSearchMessage,
	selectIsShowCanvas,
	selectIsShowMemberList,
	selectStatusMenu,
	selectTheme,
	useAppDispatch
} from '@mezon/store';
import { Loading } from '@mezon/ui';
import { EOverriddenPermission, TIME_OFFSET } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { DragEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChannelMedia } from './ChannelMedia';
import { ChannelMessageBox } from './ChannelMessageBox';
import { ChannelTyping } from './ChannelTyping';

function useChannelSeen(channelId: string) {
	const dispatch = useAppDispatch();
	const currentChannel = useSelector(selectChannelById(channelId));
	const statusFetchChannel = useSelector(selectFetchChannelStatus);
	const resetBadgeCount = !useSelector(selectAnyUnreadChannels);
	const { isFocusDesktop, isTabVisible } = useWindowFocusState();
	useEffect(() => {
		const timestamp = Date.now() / 1000;
		dispatch(channelMetaActions.setChannelLastSeenTimestamp({ channelId, timestamp: timestamp + TIME_OFFSET }));
	}, [channelId, currentChannel, dispatch]);

	useEffect(() => {
		if (!statusFetchChannel) return;
		const numberNotification = currentChannel.count_mess_unread ? currentChannel.count_mess_unread : 0;
		if (numberNotification && numberNotification > 0) {
			dispatch(channelsActions.updateChannelBadgeCount({ channelId: channelId, count: numberNotification * -1 }));
			dispatch(clansActions.updateClanBadgeCount({ clanId: currentChannel?.clan_id ?? '', count: numberNotification * -1 }));
		}
		if (!numberNotification && resetBadgeCount) {
			dispatch(clansActions.updateClanBadgeCount({ clanId: currentChannel?.clan_id ?? '', count: 0, isReset: true }));
		}
	}, [currentChannel.id, statusFetchChannel, isFocusDesktop, isTabVisible]);
}

function ChannelSeenListener({ channelId }: { channelId: string }) {
	useChannelSeen(channelId);
	return null;
}

const ChannelMainContentText = ({ channelId }: ChannelMainContentProps) => {
	const currentChannel = useSelector(selectChannelById(channelId));
	const isShowMemberList = useSelector(selectIsShowMemberList);
	const [canSendMessage] = usePermissionChecker([EOverriddenPermission.sendMessage], channelId);

	if (!canSendMessage) {
		return (
			<div className="opacity-80 dark:bg-[#34363C] bg-[#F5F6F7] ml-4 mb-4 py-2 pl-2 w-widthInputViewChannelPermission dark:text-[#4E504F] text-[#D5C8C6] rounded one-line">
				You do not have permission to send messages in this channel.
			</div>
		);
	}

	return (
		<div className={`flex-shrink flex flex-col dark:bg-bgPrimary bg-bgLightPrimary h-auto relative ${isShowMemberList ? 'w-full' : 'w-full'}`}>
			{currentChannel ? (
				<ChannelMessageBox clanId={currentChannel?.clan_id} channel={currentChannel} mode={ChannelStreamMode.STREAM_MODE_CHANNEL} />
			) : (
				<ChannelMessageBox.Skeleton />
			)}
			{currentChannel && (
				<ChannelTyping
					channelId={currentChannel?.id}
					mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
					isPublic={currentChannel ? !currentChannel.channel_private : false}
				/>
			)}
		</div>
	);
};

type ChannelMainContentProps = {
	channelId: string;
};

const ChannelMainContent = ({ channelId }: ChannelMainContentProps) => {
	const currentChannel = useSelector(selectChannelById(channelId));
	const { draggingState, setDraggingState, isOverUploading, setOverUploadingState } = useDragAndDrop();
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const isSearchMessage = useSelector(selectIsSearchMessage(channelId));
	const closeMenu = useSelector(selectCloseMenu);
	const statusMenu = useSelector(selectStatusMenu);
	const isShowMemberList = useSelector(selectIsShowMemberList);
	const isShowCanvas = useSelector(selectIsShowCanvas);
	const { isShowCreateThread, setIsShowCreateThread } = useThreads();
	const appChannel = useSelector(selectAppChannelById(channelId));
	const appearanceTheme = useSelector(selectTheme);

	const handleDragEnter = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isShowCanvas) return;
		if (e.dataTransfer?.types.includes('Files')) {
			setDraggingState(true);
		}
	};

	useEffect(() => {
		if (isShowMemberList) {
			setIsShowCreateThread(false);
		}
	}, [isShowMemberList, setIsShowCreateThread]);

	useEffect(() => {
		if (appChannel?.url) {
			const handleMessage = (event: MessageEvent) => {
				if (event.origin === appChannel?.url) {
					// implement logic here
				}
			};
			window.addEventListener('message', handleMessage);
			return () => window.removeEventListener('message', handleMessage);
		}
	}, [appChannel?.url]);

	return currentChannel.type === ChannelType.CHANNEL_TYPE_APP ? (
		appChannel?.url ? (
			<iframe title={appChannel?.url} src={appChannel?.url} className={'w-full h-full'}></iframe>
		) : (
			<div className={'w-full h-full flex items-center justify-center'}>
				<Loading />
			</div>
		)
	) : (
		<>
			{!isShowCanvas && draggingState && <FileUploadByDnD currentId={currentChannel?.channel_id ?? ''} />}
			{isOverUploading && <TooManyUpload togglePopup={() => setOverUploadingState(false)} />}
			<div
				className="flex flex-col flex-1 shrink min-w-0 bg-transparent h-[100%] overflow-hidden z-10"
				id="mainChat"
				onDragEnter={handleDragEnter}
			>
				<div className={`flex flex-row ${closeMenu ? 'h-heightWithoutTopBarMobile' : 'h-heightWithoutTopBar'}`}>
					{!isShowCanvas && (
						<div
							className={`flex flex-col flex-1 min-w-60 ${isShowMemberList ? 'w-widthMessageViewChat' : isShowCreateThread ? 'w-widthMessageViewChatThread' : isSearchMessage ? 'w-widthSearchMessage' : 'w-widthThumnailAttachment'} h-full ${closeMenu && !statusMenu && isShowMemberList && currentChannel.type !== ChannelType.CHANNEL_TYPE_STREAMING && 'hidden'} z-10`}
						>
							<div
								className={`relative dark:bg-bgPrimary max-w-widthMessageViewChat bg-bgLightPrimary ${closeMenu ? 'h-heightMessageViewChatMobile' : 'h-heightMessageViewChat'}`}
								ref={messagesContainerRef}
							>
								<ChannelMedia currentChannel={currentChannel} key={currentChannel?.channel_id} />
							</div>
							<ChannelMainContentText channelId={currentChannel?.id as string} />
						</div>
					)}
					{!isShowCanvas && isShowMemberList && currentChannel.type !== ChannelType.CHANNEL_TYPE_STREAMING && (
						<div
							onContextMenu={(event) => event.preventDefault()}
							className={` dark:bg-bgSecondary bg-bgLightSecondary text-[#84ADFF] relative overflow-y-scroll hide-scrollbar ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'hidden' : 'flex'} ${closeMenu && !statusMenu && isShowMemberList ? 'w-full' : 'w-widthMemberList'}`}
							id="memberList"
						>
							<div className="w-1 h-full dark:bg-bgPrimary bg-bgLightPrimary"></div>
							<MemberList />
						</div>
					)}

					{isShowCanvas && currentChannel.type !== ChannelType.CHANNEL_TYPE_STREAMING && (
						<div
							className={`w-full flex justify-center overflow-y-scroll overflow-x-hidden ${appearanceTheme === 'light' ? 'customScrollLightMode' : ''}`}
						>
							<Canvas />
						</div>
					)}
					{isSearchMessage && currentChannel.type !== ChannelType.CHANNEL_TYPE_STREAMING && <SearchMessageChannel />}
				</div>
			</div>
		</>
	);
};

export default function ChannelMain() {
	const currentChannel = useSelector(selectCurrentChannel);

	if (!currentChannel) {
		return null;
	}

	return (
		<>
			<ChannelMainContent channelId={currentChannel.id} />
			<ChannelSeenListener channelId={currentChannel?.id || ''} />
		</>
	);
}

const SearchMessageChannel = () => {
	const { totalResult, currentPage, searchMessages } = useSearchMessages();
	return <SearchMessageChannelRender searchMessages={searchMessages} currentPage={currentPage} totalResult={totalResult} />;
};
