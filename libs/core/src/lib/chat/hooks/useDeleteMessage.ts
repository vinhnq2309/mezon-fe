import { messagesActions, selectCurrentChannel, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type UseDeleteMessageOptions = {
	channelId: string;
	mode: number;
};

export function useDeleteMessage({ channelId, mode }: UseDeleteMessageOptions) {
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId);

	const { clientRef, sessionRef, socketRef } = useMezon();
	const channel = useSelector(selectCurrentChannel);

	const deleteSendMessage = React.useCallback(
		async (messageId: string) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			dispatch(
				messagesActions.remove({
					channelId,
					messageId,
				}),
			);

			console.log(channelId, mode, messageId);
			await socket.removeChatMessage(channelId, mode, messageId);
		},
		[sessionRef, clientRef, socketRef, channel, currentClanId, dispatch, channelId, mode],
	);

	return useMemo(
		() => ({
			deleteSendMessage,
		}),
		[deleteSendMessage],
	);
}
