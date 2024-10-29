import { ELoadMoreDirection, IBeforeRenderCb, useChatScroll } from '@mezon/chat-scroll';
import { AnchorScroll, MessageContextMenuProvider } from '@mezon/components';
import { useAuth } from '@mezon/core';
import {
	messagesActions,
	pinMessageActions,
	selectAllChannelMemberIds,
	selectAllRoleIds,
	selectDataReferences,
	selectHasMoreBottomByChannelId,
	selectHasMoreMessageByChannelId,
	selectIdMessageToJump,
	selectIsJumpingToPresent,
	selectIsMessageIdExist,
	selectIsViewingOlderMessagesByChannelId,
	selectJumpPinMessageId,
	selectLastMessageByChannelId,
	selectLastMessageIdByChannelId,
	selectMessageIdsByChannelId,
	selectMessageIsLoading,
	selectMessageNotified,
	selectUnreadMessageIdByChannelId,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Direction_Mode } from '@mezon/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChannelType } from 'mezon-js';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChannelMessage, MemorizedChannelMessage } from './ChannelMessage';

type ChannelMessagesProps = {
	clanId: string;
	channelId: string;
	type: ChannelType;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
	userName?: string;
	userIdsFromThreadBox?: string[];
	isThreadBox?: boolean;
};

function ChannelMessages({
	clanId,
	channelId,
	channelLabel,
	avatarDM,
	userName,
	mode,
	userIdsFromThreadBox,
	isThreadBox = false
}: ChannelMessagesProps) {
	const messages = useAppSelector((state) => selectMessageIdsByChannelId(state, channelId));
	const chatRef = useRef<HTMLDivElement | null>(null);
	const idMessageNotified = useSelector(selectMessageNotified);
	const idMessageToJump = useSelector(selectIdMessageToJump);
	const isJumpingToPresent = useSelector(selectIsJumpingToPresent(channelId));
	const isViewOlderMessage = useSelector(selectIsViewingOlderMessagesByChannelId(channelId));
	const isMessageExist = useSelector(selectIsMessageIdExist(channelId, idMessageToJump));
	const isFetching = useSelector(selectMessageIsLoading);
	const hasMoreTop = useSelector(selectHasMoreMessageByChannelId(channelId));
	const hasMoreBottom = useSelector(selectHasMoreBottomByChannelId(channelId));
	const lastMessage = useAppSelector((state) => selectLastMessageByChannelId(state, channelId));
	const { userId } = useAuth();
	const getMemberIds = useAppSelector((state) => selectAllChannelMemberIds(state, channelId as string));
	const allUserIdsInChannel = isThreadBox ? userIdsFromThreadBox : getMemberIds;
	const allRolesInClan = useSelector(selectAllRoleIds);
	const jumpPinMessageId = useSelector(selectJumpPinMessageId);
	const isPinMessageExist = useSelector(selectIsMessageIdExist(channelId, jumpPinMessageId));
	const dataReferences = useSelector(selectDataReferences(channelId ?? ''));
	const lastMessageId = useAppSelector((state) => selectLastMessageIdByChannelId(state, channelId as string));
	const lastMessageUnreadId = useAppSelector((state) => selectUnreadMessageIdByChannelId(state, channelId as string));
	const dispatch = useAppDispatch();

	const chatRefData = useMemo(() => {
		return {
			data: messages,
			hasNextPage: hasMoreBottom,
			hasPreviousPage: hasMoreTop
		};
	}, [messages, hasMoreBottom, hasMoreTop]);

	const loadMoreMessage = useCallback(
		async (direction: ELoadMoreDirection, cb: IBeforeRenderCb) => {
			if (isFetching) {
				return;
			}

			if (direction === ELoadMoreDirection.bottom && !hasMoreBottom) {
				return;
			}

			if (direction === ELoadMoreDirection.top && !hasMoreTop) {
				return;
			}

			if (typeof cb === 'function') {
				cb();
			}

			if (direction === ELoadMoreDirection.bottom) {
				await dispatch(messagesActions.loadMoreMessage({ clanId, channelId, direction: Direction_Mode.AFTER_TIMESTAMP }));
				return true;
			}

			await dispatch(messagesActions.loadMoreMessage({ clanId, channelId, direction: Direction_Mode.BEFORE_TIMESTAMP }));

			return true;
		},
		[dispatch, clanId, channelId, hasMoreTop, hasMoreBottom, isFetching]
	);

	const chatScrollRef = useChatScroll<HTMLDivElement>(chatRef, chatRefData, loadMoreMessage);

	const getChatScrollBottomOffset = useCallback(() => {
		const element = chatRef.current;
		if (!element) {
			return 0;
		}
		return Math.abs(element?.scrollHeight - element?.clientHeight - element?.scrollTop);
	}, []);

	const cacheLastChannelId = useRef<string | null>(null);
	useLayoutEffect(() => {
		if (chatRef.current && messages?.length && lastMessage?.channel_id && cacheLastChannelId.current !== lastMessage?.channel_id) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	});

	useEffect(() => {
		if (messages.length && lastMessage && cacheLastChannelId.current !== lastMessage?.channel_id) {
			setTimeout(() => {
				cacheLastChannelId.current = lastMessage?.channel_id as string;
			}, 100);
		}
	}, [messages, lastMessage]);

	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => chatRef.current,
		estimateSize: () => 50,
		overscan: 5
	});

	const scrollToLastMessage = useCallback(() => {
		return new Promise((rs) => {
			const index = messages.length - 1;

			index >= 0 && rowVirtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' });
			rs(true);
		});
	}, [messages, rowVirtualizer]);

	useEffect(() => {
		if (dataReferences && getChatScrollBottomOffset() <= 61) {
			scrollToLastMessage();
		}
	}, [dataReferences, lastMessage, scrollToLastMessage, getChatScrollBottomOffset]);

	// Jump to ,message from pin and reply, notification...
	const timerRef = useRef<number | null>(null);
	useEffect(() => {
		const handleScrollToIndex = (messageId: string) => {
			const index = messages.findIndex((item) => item === messageId);
			if (index >= 0) {
				rowVirtualizer.scrollToIndex(index, { align: 'center', behavior: 'auto' });
			}
		};

		if (jumpPinMessageId && isPinMessageExist) {
			handleScrollToIndex(jumpPinMessageId);
			timerRef.current = window.setTimeout(() => {
				dispatch(pinMessageActions.setJumpPinMessageId(null));
			}, 1000);
		} else if (idMessageToJump && isMessageExist && jumpPinMessageId === null) {
			handleScrollToIndex(idMessageToJump);
			timerRef.current = window.setTimeout(() => {
				dispatch(messagesActions.setIdMessageToJump(null));
			}, 1000);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [dispatch, jumpPinMessageId, isPinMessageExist, idMessageToJump, isMessageExist, messages, rowVirtualizer]);

	// Jump to present when user is jumping to present
	useEffect(() => {
		if (isJumpingToPresent) {
			scrollToLastMessage().then(() => {
				dispatch(messagesActions.setIsJumpingToPresent({ channelId, status: false }));
			});
		}
	}, [dispatch, isJumpingToPresent, chatScrollRef, channelId, scrollToLastMessage]);

	// Update last message of channel when component unmount
	useEffect(() => {
		chatScrollRef.updateLoadMoreCb(loadMoreMessage);
	}, [loadMoreMessage, chatScrollRef]);

	// Handle scroll to bottom when user on the bottom and received new message
	useEffect(() => {
		if (isViewOlderMessage) {
			return;
		}
		if (userId === lastMessage?.sender_id) {
			scrollToLastMessage();
			return;
		}
	}, [lastMessage, userId, isViewOlderMessage, scrollToLastMessage, getChatScrollBottomOffset]);

	return (
		<MessageContextMenuProvider allUserIdsInChannel={allUserIdsInChannel as string[]} allRolesInClan={allRolesInClan}>
			<AnchorScroll ref={chatRef} anchorId={channelId}>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative'
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const messageId = messages[virtualRow.index];
						const checkMessageTargetToMoved = idMessageToJump === messageId && messageId !== lastMessageId;
						const messageReplyHighlight = (dataReferences?.message_ref_id && dataReferences?.message_ref_id === messageId) || false;

						return (
							<div
								key={virtualRow.index}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`
								}}
							>
								<div key={virtualRow.key} data-index={virtualRow.index} ref={rowVirtualizer.measureElement}>
									<MemorizedChannelMessage
										index={virtualRow.index}
										avatarDM={avatarDM}
										userName={userName}
										key={messageId}
										messageId={messageId}
										previousMessageId={messages[virtualRow.index - 1]}
										channelId={channelId}
										isHighlight={messageId === idMessageNotified}
										mode={mode}
										channelLabel={channelLabel ?? ''}
										isLastSeen={Boolean(messageId === lastMessageUnreadId && messageId !== lastMessageId)}
										checkMessageTargetToMoved={checkMessageTargetToMoved}
										messageReplyHighlight={messageReplyHighlight}
									/>
								</div>
							</div>
						);
					})}
				</div>
				<div className="h-[20px] w-[1px] pointer-events-none"></div>
			</AnchorScroll>
		</MessageContextMenuProvider>
	);
}

ChannelMessages.Skeleton = () => {
	if (ChannelMessage.Skeleton) {
		return (
			<>
				{/* <ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton /> */}
			</>
		);
	}
};

const MemoizedChannelMessages = memo(ChannelMessages) as unknown as typeof ChannelMessages & { Skeleton: typeof ChannelMessages.Skeleton };

export default MemoizedChannelMessages;
