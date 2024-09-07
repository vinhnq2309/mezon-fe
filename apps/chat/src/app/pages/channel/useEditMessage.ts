import { useChatSending } from '@mezon/core';
import { messagesActions, referencesActions, selectIdMessageRefEdit, selectOpenEditMessageState } from '@mezon/store';
import { IMessageSendPayload, IMessageWithUser } from '@mezon/utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useProcessLink } from 'libs/core/src/lib/chat/hooks/useProcessLink';
import { ApiMessageAttachment, ApiMessageMention } from 'mezon-js/api.gen';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEditMessage = (channelId: string, channelLabel: string, mode: number, message: IMessageWithUser) => {
	const clanIdInMes = useMemo(() => {
		return message.clan_id;
	}, [message.clan_id]);
	const attachmentsOnMessage = useMemo(() => {
		return message.attachments;
	}, [message.attachments]);

	const dispatch = useDispatch();
	const { editSendMessage, updateImageLinkMessage } = useChatSending({ channelIdOrDirectId: channelId || '', mode });
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);

	const handleCancelEdit = useCallback(() => {
		dispatch(referencesActions.setIdReferenceMessageEdit(''));
		dispatch(messagesActions.deleteChannelDraftMessage({ channelId }));
		dispatch(referencesActions.setOpenEditMessageState(false));
	}, [channelId, dispatch]);

	const setChannelDraftMessage = useCallback(
		(
			channelId: string,
			message_id: string,
			draftContent: IMessageSendPayload,
			draftMention: ApiMessageMention[],
			attachmentsOnMessage: ApiMessageAttachment[]
		) => {
			dispatch(
				messagesActions.setChannelDraftMessage({
					channelId: channelId as string,
					channelDraftMessage: {
						message_id: message_id,
						draftContent: draftContent,
						draftMention: draftMention,
						draftAttachment: attachmentsOnMessage
					}
				})
			);
		},
		[dispatch]
	);

	const { processLink } = useProcessLink({ updateImageLinkMessage });

	const handleSend = useCallback(
		(editMessage: IMessageSendPayload, messageId: string, draftMention: ApiMessageMention[]) => {
			editSendMessage(editMessage, messageId, draftMention, attachmentsOnMessage, false);
			setChannelDraftMessage(channelId, messageId, editMessage, draftMention, attachmentsOnMessage ?? []);
			dispatch(referencesActions.setOpenEditMessageState(false));
			processLink(clanIdInMes ?? '', channelId ?? '', mode ?? 0, editMessage, draftMention, attachmentsOnMessage, messageId, message);
		},
		[editSendMessage, attachmentsOnMessage, setChannelDraftMessage, channelId, dispatch, processLink, clanIdInMes, mode, message]
	);

	return {
		openEditMessageState,
		idMessageRefEdit,
		handleCancelEdit,
		handleSend,
		setChannelDraftMessage
	};
};
