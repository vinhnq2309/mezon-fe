import { toastActions, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageWithUser } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { useMemo } from 'react';

export function useSendForwardMessage() {
	const { clientRef, sessionRef, socketRef } = useMezon();
	const dispatch = useAppDispatch();

	const client = clientRef.current;

	const sendForwardMessage = React.useCallback(
		async (clanid: string, channel_id: string, mode: number, isPublic: boolean, message: IMessageWithUser) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !channel_id) {
				console.log(client, session, socket, channel_id);
				throw new Error('Client is not initialized');
			}

			try {
				let type = ChannelType.CHANNEL_TYPE_TEXT;
				if (mode === ChannelStreamMode.STREAM_MODE_DM) {
					type = ChannelType.CHANNEL_TYPE_DM;
				} else if (mode === ChannelStreamMode.STREAM_MODE_GROUP) {
					type = ChannelType.CHANNEL_TYPE_GROUP;
				}
				await socket.joinChat(clanid, channel_id, type, isPublic);
				await socket.writeChatMessage(
					clanid,
					channel_id,
					mode,
					isPublic,
					message.content,
					message.mentions,
					message.attachments,
					message.references
				);

				dispatch(
					toastActions.addToast({
						type: 'success',
						message: 'Message forwarded successfully'
					})
				);
			} catch (e) {
				dispatch(
					toastActions.addToast({
						type: 'error',
						message: 'Failed to forward message'
					})
				);
			}
		},
		[sessionRef, clientRef, socketRef]
	);

	return useMemo(
		() => ({
			client,
			sendForwardMessage
		}),
		[client, sendForwardMessage]
	);
}
