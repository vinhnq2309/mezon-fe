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
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChannelMessage, MemorizedChannelMessage, MessageRef } from './ChannelMessage';

type ChannelMessagesProps = {
	clanId: string;
	channelId: string;
	type: ChannelType;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
	userName?: string;
};

function ChannelMessages({ clanId, channelId, channelLabel, avatarDM, userName, mode }: ChannelMessagesProps) {
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
	const listMessageRefs = useRef<Record<string, MessageRef | null>>({});
	const allUserIdsInChannel = useAppSelector((state) => selectAllChannelMemberIds(state, channelId as string));
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

	const scrollToMessageById = useCallback(
		(messageId: string, options: ScrollIntoViewOptions = { behavior: 'instant' }) => {
			return new Promise<void>((resolve) => {
				const isAtBottom = getChatScrollBottomOffset() <= 1;
				const messageElement = listMessageRefs.current[messageId];
				if (messageElement) {
					!isAtBottom && messageElement.scrollIntoView(options);
					resolve();
				} else {
					// If message not rendered yet, wait a bit and try again
					setTimeout(() => {
						!isAtBottom && listMessageRefs.current[messageId]?.scrollIntoView(options);
						resolve();
					}, 0);
				}
			});
		},
		[getChatScrollBottomOffset]
	);

	const scrollToLastMessage = useCallback(
		(options: ScrollIntoViewOptions = { behavior: 'instant' }) => {
			return scrollToMessageById(lastMessage?.id ?? '', options);
		},
		[lastMessage?.id, scrollToMessageById]
	);

	useEffect(() => {
		if (dataReferences && getChatScrollBottomOffset() <= 51) {
			scrollToLastMessage({ behavior: 'instant' });
		}
	}, [dataReferences, scrollToLastMessage, getChatScrollBottomOffset]);

	// Jump to message when user is jumping to message from pin message
	useEffect(() => {
		if (jumpPinMessageId && isPinMessageExist) {
			const messageRef = listMessageRefs.current[jumpPinMessageId];
			if (messageRef) {
				messageRef?.scrollIntoView({ behavior: 'instant', block: 'center' });
				const timeoutId = setTimeout(() => {
					dispatch(pinMessageActions.setJumpPinMessageId(null));
				}, 1000);

				return () => timeoutId && clearTimeout(timeoutId);
			}
		}
	}, [dispatch, jumpPinMessageId, isPinMessageExist, chatScrollRef]);

	// Jump to message when user is jumping to message
	useEffect(() => {
		if (idMessageToJump && isMessageExist) {
			const messageRef = listMessageRefs.current[idMessageToJump];
			if (messageRef) {
				messageRef?.scrollIntoView({ behavior: 'instant', block: 'center' });
				const timeoutId = setTimeout(() => {
					dispatch(messagesActions.setIdMessageToJump(null));
				}, 1000);

				return () => timeoutId && clearTimeout(timeoutId);
			}
		}
	}, [dispatch, idMessageToJump, isMessageExist, chatScrollRef]);

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

	// TODO: move this to another place
	useEffect(() => {
		// Update last message of channel when component unmount
		return () => {
			dispatch(
				messagesActions.UpdateChannelLastMessage({
					channelId
				})
			);
		};
	}, [channelId, dispatch]);

	// Handle scroll to bottom when user on the bottom and received new message
	useEffect(() => {
		if (isViewOlderMessage) {
			return;
		}

		if (userId === lastMessage?.sender_id) {
			scrollToLastMessage({ behavior: 'instant' });
			return;
		}

		const timeoutId = setTimeout(() => {
			const bottomOffsetToScroll = 100;
			const isNearBottom = getChatScrollBottomOffset() < bottomOffsetToScroll;
			if (isNearBottom) {
				scrollToLastMessage({ behavior: 'instant' });
			}
		}, 100);

		return () => timeoutId && clearTimeout(timeoutId);
	}, [lastMessage, userId, isViewOlderMessage, scrollToLastMessage, getChatScrollBottomOffset]);

	const refItem = useCallback((component: MessageRef | null) => {
		listMessageRefs.current[component?.messageId as string] = component;
	}, []);

	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => chatRef.current,
		estimateSize: () => 50,
		overscan: 5
	});

	return (
		<MessageContextMenuProvider allUserIdsInChannel={allUserIdsInChannel} allRolesInClan={allRolesInClan}>
			<AnchorScroll ref={chatRef} anchorId={channelId}>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative'
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
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
										ref={refItem}
										avatarDM={avatarDM}
										userName={userName}
										key={messages[virtualRow.index]}
										messageId={messages[virtualRow.index]}
										previousMessageId={messages[virtualRow.index - 1]}
										channelId={channelId}
										isHighlight={messages[virtualRow.index] === idMessageNotified}
										mode={mode}
										channelLabel={channelLabel ?? ''}
										isLastSeen={Boolean(
											messages[virtualRow.index] === lastMessageUnreadId && messages[virtualRow.index] !== lastMessageId
										)}
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
