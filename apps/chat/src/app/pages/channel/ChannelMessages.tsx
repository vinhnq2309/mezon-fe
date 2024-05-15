import { ChatWelcome } from '@mezon/components';
import { getJumpToMessageId, useChatMessages, useJumpToMessage, useMessages, useReference } from '@mezon/core';
import { useEffect, useRef, useState } from 'react';
import { ChannelMessage } from './ChannelMessage';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};

export default function ChannelMessages({ channelId, channelLabel, type, avatarDM, mode }: ChannelMessagesProps) {
	const chatRef = useRef<HTMLDivElement>(null);

	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const [messageid, setMessageIdToJump] = useState(getJumpToMessageId());
	const [timeToJump, setTimeToJump] = useState(1000);
	const [positionToJump, setPositionToJump] = useState<ScrollLogicalPosition>('start');
	const { jumpToMessage } = useJumpToMessage();
	const { idMessageReplied } = useReference();

	// share logic to load more message
	const isFetching = useMessages({ chatRef, hasMoreMessage, loadMoreMessage });

	useEffect(() => {
		if (idMessageReplied) {
			setMessageIdToJump(idMessageReplied);
			setTimeToJump(0);
			setPositionToJump('center');
		} else {
			setMessageIdToJump(getJumpToMessageId());
			setTimeToJump(1000);
			setPositionToJump('start');
		}
	}, [getJumpToMessageId, idMessageReplied]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;
		if (messageid) {
			timeoutId = setTimeout(() => {
				jumpToMessage(messageid, positionToJump);
			}, timeToJump);
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [messageid, jumpToMessage]);

	return (
		<div
			className="dark:bg-bgPrimary bg-bgLightModeSecond relative h-full overflow-y-scroll overflow-x-hidden flex-col-reverse flex"
			id="scrollLoading"
			ref={chatRef}
			style={{ scrollbarWidth: 'thin' }}
		>
			{messages.map((message, i) => (
				<ChannelMessage
					mode={mode}
					key={message.id}
					lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
					message={message}
					preMessage={messages.length > 0 ? messages[i - 1] : undefined}
					channelId={channelId}
					channelLabel={channelLabel || ''}
				/>
			))}

			{isFetching && hasMoreMessage && <p className="px-3">Loading messages</p>}
			{!hasMoreMessage && <ChatWelcome type={type} name={channelLabel} avatarDM={avatarDM} />}
		</div>
	);
}

ChannelMessages.Skeleton = () => {
	return (
		<>
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
		</>
	);
};
