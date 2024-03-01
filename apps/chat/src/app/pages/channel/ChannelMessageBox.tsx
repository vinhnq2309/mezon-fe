import { MentionData } from '@draft-js-plugins/mention';
import { MessageBox } from '@mezon/components';
import { useChannelMembers, useChatSending } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { useCallback } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { ApiMessageMention, ApiMessageAttachment, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

type ChannelMessageBoxProps = {
	channelId: string;
	controlEmoji?: boolean;
	clanId?:string
};

export function ChannelMessageBox({ channelId, controlEmoji,clanId }: ChannelMessageBoxProps) {
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId });

	const handleSend = useCallback(
		(content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>, 
			attachments?: Array<ApiMessageAttachment>,
			refrences?: Array<ApiMessageRef>) => {
			sendMessage(content, mentions, attachments, refrences);
		},
		[sendMessage],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);
	const { members } = useChannelMembers({ channelId });
	const userMentionRaw = members[0].users;
	const newUserMentionList: MentionData[] = userMentionRaw?.map((item: ChannelMembersEntity) => ({
		avatar: item?.user?.avatar_url ?? '',
		name: item?.user?.username ?? '',
		id: item?.user?.id ?? '',
	}));

	return (
		<div>
			<MessageBox
				isOpenEmojiPropOutside={controlEmoji}
				listMentions={newUserMentionList}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
				currentChannelId={channelId}
				currentClanId={clanId}
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
