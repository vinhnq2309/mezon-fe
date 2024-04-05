import { useChatReactionMessage } from '@mezon/core';
import { ChannelStreamMode } from '@mezon/mezon-js';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react';

export type EmojiPickerOptions = {
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
	mode?: number;
	emojiExist?: string;
};

function EmojiPickerComp(props: EmojiPickerOptions) {
	const { reactionMessage, setIsOpenEmojiReacted, setIsOpenEmojiReactedBottom } = useChatReactionMessage();
	const handleEmojiSelect = async (emojiData: EmojiClickData, event: MouseEvent) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
			await reactionMessage(
				'',
				props.mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
				props.messageEmoji?.id ?? '',
				emojiData.emoji,
				1,
				props.messageEmoji?.sender_id ?? '',
				false,
			);
			event.stopPropagation();
			setIsOpenEmojiReacted(false);
			setIsOpenEmojiReactedBottom(false);
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			event.stopPropagation();
		}
	};

	return (
		<>
			<div onClick={(event) => event.stopPropagation()} className="z-20">
				<EmojiPicker
					suggestedEmojisMode={SuggestionMode.FREQUENT}
					onEmojiClick={handleEmojiSelect}
					width={500}
					theme={Theme.DARK}
					height={458}
					emojiStyle={EmojiStyle.NATIVE}
				/>
			</div>
		</>
	);
}

export default EmojiPickerComp;
