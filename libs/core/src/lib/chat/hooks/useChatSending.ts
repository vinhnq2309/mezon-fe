import { useFilteredContent } from '@mezon/core';
import {
	messagesActions,
	selectChannelById,
	selectCurrentClanId,
	selectCurrentUserId,
	selectDirectById,
	selectNewIdMessageResponse,
	selectNewMesssageUpdateImage,
	useAppDispatch,
} from '@mezon/store';
import { handleUrlInput, useMezon } from '@mezon/transport';
import { ETypeLinkMedia, IMessageSendPayload } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppParams } from '../../app/hooks/useAppParams';

export type UseChatSendingOptions = {
	channelId: string;
	mode: number;
	directMessageId?: string;
};

// TODO: separate this hook into 2 hooks for send and edit message
export function useChatSending({ channelId, mode, directMessageId }: UseChatSendingOptions) {
	const { directId } = useAppParams();
	const currentClanId = useSelector(selectCurrentClanId);
	const currentUserId = useSelector(selectCurrentUserId);
	const idNewMessageResponse = useSelector(selectNewIdMessageResponse);
	const newMessageUpdateImage = useSelector(selectNewMesssageUpdateImage);
	console.log('newMessageUpdateImage :', newMessageUpdateImage);

	const dispatch = useAppDispatch();
	// TODO: if direct is the same as channel use one slice
	// If not, using 2 hooks for direct and channel
	const direct = useSelector(selectDirectById(directMessageId || directId || ''));
	const { clientRef, sessionRef, socketRef } = useMezon();
	const channel = useSelector(selectChannelById(channelId));
	let channelID = channelId;
	let clanID = currentClanId;
	if (direct) {
		channelID = direct.id;
		clanID = '0';
	}

	const [filteredLinkResults, setFilteredLinkResults] = React.useState<ApiMessageAttachment[]>([]);
	// const [filteredContent, setFilterContent] = useState<IMessageSendPayload>({});
	// const [filteredMention, setFilterMention] = useState<IMentionOnMessage[]>([]);

	const sendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			anonymous?: boolean,
			mentionEveryone?: boolean,
		) => {
			const filteredContent = useFilteredContent(content);
			// setFilterContent(filteredContent ?? {});
			// setFilterMention(mentions ?? []);
			return dispatch(
				messagesActions.sendMessage({
					channelId: channelID,
					clanId: clanID || '',
					mode,
					content: filteredContent ?? {},
					mentions,
					attachments,
					references,
					anonymous,
					mentionEveryone,
					senderId: currentUserId,
				}),
			);
		},
		[dispatch, channelID, clanID, mode, currentUserId],
	);
	type LinkQueueItem = {
		messageId: string;
		filteredLinkResults: ApiMessageAttachment[];
	};

	const [linkQueue, setLinkQueue] = useState<LinkQueueItem[]>([]);
	useEffect(() => {
		if (!newMessageUpdateImage.content.lk || !idNewMessageResponse) return;

		const processUrls = async () => {
			const resultPromises = (newMessageUpdateImage.content.lk ?? []).map(async (item: any) => {
				const result = await handleUrlInput(item.lk as string);
				if (result.filetype && result.filetype.startsWith(ETypeLinkMedia.IMAGE_PREFIX)) {
					return result as ApiMessageAttachment;
				}
				return null;
			});

			const results = await Promise.all(resultPromises);
			const filteredLinkProcess = results.filter((result): result is ApiMessageAttachment => result !== null) as ApiMessageAttachment[];

			if (filteredLinkProcess.length > 0) {
				setLinkQueue((prevQueue) => [...prevQueue, { messageId: idNewMessageResponse, filteredLinkResults: filteredLinkProcess }]);
			}
		};

		processUrls();
	}, [idNewMessageResponse]);

	useEffect(() => {
		if (linkQueue.length === 0) return;

		const processQueue = async () => {
			const [currentBatch, ...restQueue] = linkQueue;

			const result = checkContentContainsOnlyUrls(newMessageUpdateImage.content.t ?? '', currentBatch.filteredLinkResults);

			editSendMessage(
				result ? {} : newMessageUpdateImage.content,
				currentBatch.messageId,
				newMessageUpdateImage.mentions,
				currentBatch.filteredLinkResults,
			);

			setLinkQueue(restQueue);
		};

		processQueue();
	}, [linkQueue]);

	function checkContentContainsOnlyUrls(content: string, urls: ApiMessageAttachment[]) {
		const urlsToCheck = urls.map((item) => item.url);
		const lines = content.split('\n').filter((line) => line.trim() !== '');
		const urlsInContent = lines.filter((line) => urlsToCheck.includes(line.trim()));
		return urlsInContent.length === 1 && urlsInContent[0] === urlsToCheck[0];
	}

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ clanId: clanID || '', channelId, mode }));
	}, [channelId, clanID, dispatch, mode]);

	// Move this function to to a new action of messages slice
	const editSendMessage = React.useCallback(
		async (content: IMessageSendPayload, messageId: string, mentions: ApiMessageMention[], attachments?: ApiMessageAttachment[]) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}

			const filteredContent = useFilteredContent(content);

			await socket.updateChatMessage(clanID || '', channelId, mode, messageId, filteredContent, mentions, attachments);
		},
		[sessionRef, clientRef, socketRef, channel, direct, clanID, channelId, mode],
	);

	return useMemo(
		() => ({
			sendMessage,
			sendMessageTyping,
			editSendMessage,
		}),
		[sendMessage, sendMessageTyping, editSendMessage],
	);
}
