import { GifStickerEmojiPopup, MessageBox, ReplyMessageBox, UserMentionList } from '@mezon/components';
import { useDirectMessages, useGifsStickersEmoji } from '@mezon/core';
import { RootState, selectIdMessageRefReaction, selectIdMessageRefReply, selectIsShowMemberList } from '@mezon/store';
import { EmojiPlaces, IMessageSendPayload, SubPanelName } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';

interface DirectIdProps {
	directParamId: string;
	mode: number;
}
export function DirectMessageBox({ directParamId, mode }: DirectIdProps) {
	const { sendDirectMessage, sendMessageTyping } = useDirectMessages({ channelId: directParamId, mode: mode });
	// TODO: move selector to store
	const sessionUser = useSelector((state: RootState) => state.auth.session);
	const isShowMemberList = useSelector(selectIsShowMemberList);
	const { subPanelActive } = useGifsStickersEmoji();
	const [isEmojiOnChat, setIsEmojiOnChat] = useState<boolean>(false);
	const [emojiAction, setEmojiAction] = useState<EmojiPlaces>(EmojiPlaces.EMOJI_REACTION_NONE);
	const idMessageRefReaction = useSelector(selectIdMessageRefReaction);
	const messageBox = useRef<HTMLDivElement>(null);
	const idMessageRefReply = useSelector(selectIdMessageRefReply(directParamId));

	const setMarginleft = useMemo(() => {
		if (messageBox?.current?.getBoundingClientRect()) {
			return window.innerWidth - messageBox?.current?.getBoundingClientRect().right + 10;
		}
	}, [messageBox.current?.getBoundingClientRect()]);

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>
		) => {
			if (sessionUser) {
				sendDirectMessage(content, mentions, [], references);
			} else {
				console.error('Session is not available');
			}
		},
		[sendDirectMessage, sessionUser]
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);
	useEffect(() => {
		const isActive =
			(subPanelActive !== SubPanelName.NONE &&
				subPanelActive !== SubPanelName.EMOJI_REACTION_RIGHT &&
				subPanelActive !== SubPanelName.EMOJI_REACTION_BOTTOM) ||
			((subPanelActive === SubPanelName.EMOJI_REACTION_RIGHT || subPanelActive === SubPanelName.EMOJI_REACTION_BOTTOM) &&
				window.innerWidth < 640);

		setIsEmojiOnChat(isActive);
	}, [subPanelActive]);
	return (
		<div className="mx-2 relative " role="button" ref={messageBox}>
			{isEmojiOnChat && (
				<div
					style={{
						position: 'fixed',
						bottom: '76px',
						right: setMarginleft
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="z-20"
				>
					<GifStickerEmojiPopup emojiAction={EmojiPlaces.EMOJI_EDITOR} mode={mode} />
				</div>
			)}
			{idMessageRefReply && <ReplyMessageBox channelId={directParamId} idMessage={idMessageRefReply} />}
			<MessageBox
				onSend={handleSend}
				currentChannelId={directParamId}
				onTyping={handleTypingDebounced}
				listMentions={UserMentionList({ channelID: directParamId, channelMode: mode })}
				mode={mode}
			/>
		</div>
	);
}

DirectMessageBox.Skeleton = () => {
	return (
		<div>
			<MessageBox.Skeleton />
		</div>
	);
};

export default DirectMessageBox;
