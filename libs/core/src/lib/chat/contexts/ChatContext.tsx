import { channelMembersActions, friendsActions, mapMessageChannelToEntity, messagesActions, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
	ChannelMessageEvent,
	ChannelPresenceEvent,
	MessageReactionEvent,
	MessageTypingEvent,
	Notification,
	StatusPresenceEvent,
} from 'vendors/mezon-js/packages/mezon-js/dist';
import { useAuth } from '../../auth/hooks/useAuth';
import { useSeenMessagePool } from '../hooks/useSeenMessagePool';

type ChatContextProviderProps = {
	children: React.ReactNode;
};

export type ChatContextValue = {
	// TODO: add your context value here
};

const ChatContext = React.createContext<ChatContextValue>({} as ChatContextValue);

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
	const { socketRef } = useMezon();
	const { userId } = useAuth();
	const { initWorker, unInitWorker } = useSeenMessagePool();
	const dispatch = useAppDispatch();

	const onchannelmessage = useCallback(
		(message: ChannelMessageEvent) => {
			dispatch(messagesActions.newMessage(mapMessageChannelToEntity(message)));
		},
		[dispatch],
	);

	const onchannelpresence = useCallback(
		(channelPresence: ChannelPresenceEvent) => {
			dispatch(channelMembersActions.fetchChannelMembersPresence(channelPresence));
		},
		[dispatch],
	);

	const onstatuspresence = useCallback(
		(statusPresence: StatusPresenceEvent) => {
			dispatch(channelMembersActions.updateStatusUser(statusPresence));
		},
		[dispatch],
	);

	const onnotification = useCallback(
		(notification: Notification) => {
			if (notification.code === -2 || notification.code === -3) {
				dispatch(friendsActions.fetchListFriends());
				toast.info(notification.subject);
			}
		},
		[dispatch],
	);
	const ondisconnect = useCallback(() => {
		// TODO: handle disconnect
	}, []);

	const onmessagetyping = useCallback(
		(e: MessageTypingEvent) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const event = (e as any).message_typing_event;
			if (event.sender_id === userId) {
				return;
			}

			dispatch(
				messagesActions.updateTypingUsers({
					channelId: event.channel_id,
					userId: event.sender_id,
					isTyping: true,
				}),
			);
		},
		[dispatch, userId],
	);

	const onmessagereaction = useCallback(
		(e: MessageReactionEvent) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const event = (e as any).message_reaction_event;
			dispatch(
				messagesActions.updateReactionMessage({
					channelId: event.channel_id,
					messageId: event.message_id,
					emoji: event.emoji,
					userId:event.sender_id
				}),
			);
		},
		[dispatch, userId],
	);

	const value = React.useMemo<ChatContextValue>(() => ({}), []);

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket) {
			return;
		}

		socket.onchannelmessage = onchannelmessage;

		socket.onchannelpresence = onchannelpresence;

		socket.ondisconnect = ondisconnect;

		socket.onmessagetyping = onmessagetyping;

		socket.onmessagereaction = onmessagereaction;

		socket.onnotification = onnotification;

		socket.onstatuspresence = onstatuspresence;

		return () => {
			socket.onchannelmessage = () => {};
			socket.onchannelpresence = () => {};
			socket.onnotification = () => {};
			socket.onstatuspresence = () => {};
			socket.ondisconnect = () => {};
			
		};
	}, [onchannelmessage, onchannelpresence, ondisconnect, onmessagetyping, onmessagereaction, onnotification, onstatuspresence, socketRef]);

	useEffect(() => {
		initWorker();
		return () => {
			unInitWorker();
		};
	}, [initWorker, unInitWorker]);

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const ChatContextConsumer = ChatContext.Consumer;

export { ChatContext, ChatContextConsumer, ChatContextProvider };
