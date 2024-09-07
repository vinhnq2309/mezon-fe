import { GifStickerEmojiPopup, MessageBox, ReplyMessageBox, UserMentionList } from '@mezon/components';
import { useChatSending, useEscapeKey, useGifsStickersEmoji } from '@mezon/core';
import { referencesActions, selectDataReferences } from '@mezon/store';
import { EmojiPlaces, IMessageSendPayload, SubPanelName, ThreadValue, blankReferenceObj } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';

export type ChannelMessageBoxProps = {
	channelId: string;
	clanId?: string;
	mode: number;
};

export function ChannelMessageBox({ channelId, clanId, mode }: Readonly<ChannelMessageBoxProps>) {
	const dispatch = useDispatch();
	const { sendMessage, sendMessageTyping } = useChatSending({ channelIdOrDirectId: channelId, mode });
	const { subPanelActive } = useGifsStickersEmoji();

	const dataReferences = useSelector(selectDataReferences(channelId ?? ''));
	const [isEmojiOnChat, setIsEmojiOnChat] = useState<boolean>(false);

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			value?: ThreadValue,
			anonymous?: boolean,
			mentionEveryone?: boolean
		) => {
			sendMessage(content, mentions, attachments, references, anonymous, mentionEveryone);
		},
		[sendMessage]
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);
	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	useEffect(() => {
		const isEmojiReactionPanel = subPanelActive === SubPanelName.EMOJI_REACTION_RIGHT || subPanelActive === SubPanelName.EMOJI_REACTION_BOTTOM;

		const isOtherActivePanel = subPanelActive !== SubPanelName.NONE && !isEmojiReactionPanel;

		const isSmallScreen = window.innerWidth < 640;

		const isActive = isOtherActivePanel || (isEmojiReactionPanel && isSmallScreen);

		setIsEmojiOnChat(isActive);
	}, [subPanelActive]);

	const handleCloseReplyMessageBox = () => {
		dispatch(
			referencesActions.setDataReferences({
				channelId: channelId,
				dataReferences: blankReferenceObj
			})
		);
	};

	useEscapeKey(handleCloseReplyMessageBox);
	return (
		<div className="mx-4 relative" role="button">
			{isEmojiOnChat && (
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="max-sbm:bottom-[60px] bottom-[76px] right-[10px] absolute bg"
				>
					<GifStickerEmojiPopup channelIdOrDirectId={channelId} emojiAction={EmojiPlaces.EMOJI_EDITOR} mode={mode} />
				</div>
			)}
			{dataReferences.message_ref_id && <ReplyMessageBox channelId={channelId} dataReferences={dataReferences} />}
			<MessageBox
				listMentions={UserMentionList({ channelID: channelId, channelMode: mode })}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
				currentChannelId={channelId}
				currentClanId={clanId}
				mode={mode}
			/>
		</div>
	);
}

ChannelMessageBox.Skeleton = () => {
	return (
		<div>
			<MessageBox.Skeleton />
		</div>
	);
};
