import { channelMetaActions, messagesActions, selectCurrentChannel, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type UseThreadMessage = {
	channelId: string;
	mode: number;
};

export function useThreadMessage({ channelId, mode }: UseThreadMessage) {
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannel = useSelector(selectCurrentChannel);
	const dispatch = useAppDispatch();

	const { clientRef, sessionRef, socketRef } = useMezon();

	const sendMessageThread = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			thread?: ApiChannelDescription
		) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !thread || !currentClanId) {
				throw new Error('Client is not initialized');
			}

			await socket.writeChatMessage(
				currentClanId,
				thread.channel_id as string,
				mode,
				!currentChannel?.channel_private,
				{ t: content.t },
				mentions,
				attachments,
				references
			);
			if (content.contentThread) {
				await socket.writeChatMessage(
					currentClanId,
					thread.channel_id as string,
					mode,
					!currentChannel?.channel_private,
					{ t: content.contentThread },
					[],
					[],
					undefined
				);
			}

			const timestamp = Date.now() / 1000;
			dispatch(channelMetaActions.setChannelLastSeenTimestamp({ channelId, timestamp }));
		},
		[sessionRef, clientRef, socketRef, currentClanId, mode, currentChannel?.channel_private, dispatch, channelId]
	);

	const sendMessageTyping = React.useCallback(async () => {
		if (channelId) {
			dispatch(
				messagesActions.sendTypingUser({
					clanId: currentClanId || '',
					channelId,
					mode,
					isPublic: !currentChannel?.channel_private
				})
			);
		}
	}, [channelId, currentChannel?.channel_private, currentClanId, dispatch, mode]);

	const EditSendMessage = React.useCallback(
		async (content: string, messageId: string) => {
			const editMessage: IMessageSendPayload = {
				t: content
			};
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			await socket.updateChatMessage(currentClanId, channelId, mode, !currentChannel?.channel_private, messageId, editMessage);
		},
		[sessionRef, clientRef, socketRef, currentClanId, channelId, mode, currentChannel?.channel_private]
	);

	return useMemo(
		() => ({
			sendMessageThread,
			sendMessageTyping,
			EditSendMessage
		}),
		[sendMessageThread, sendMessageTyping, EditSendMessage]
	);
}
