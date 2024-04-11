import { Icons, MentionReactInput, UserMentionList } from '@mezon/components';
import { useThreadMessage, useThreads } from '@mezon/core';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { RootState, createNewChannel, selectCurrentChannel, selectCurrentChannelId, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { ETypeMessage, IMessageSendPayload } from '@mezon/utils';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';
import { ApiCreateChannelDescRequest, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import ChannelMessages from '../channel/ChannelMessages';

const ThreadBox = () => {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentClanId = useSelector(selectCurrentClanId);
	const sessionUser = useSelector((state: RootState) => state.auth.session);

	const { threadRef } = useMezon();
	const thread = threadRef.current;
	const { currentThread } = useThreads();
	const { sendMessageThread, sendMessageTyping } = useThreadMessage({
		channelId: thread?.id as string,
		channelLabel: thread?.chanel_label as string,
		mode: ChannelStreamMode.STREAM_MODE_CHANNEL,
	});

	const createThread = async (name: string) => {
		const body: ApiCreateChannelDescRequest = {
			clan_id: currentClanId?.toString(),
			channel_label: name,
			parrent_id: currentChannelId as string,
			category_id: currentChannel?.category_id,
			type: ChannelType.CHANNEL_TYPE_TEXT,
		};
		await dispatch(createNewChannel(body));
	};

	const handleSend = useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			value?: string,
		) => {
			if (sessionUser) {
				if (value) {
					await createThread(value as string);
				}
				await sendMessageThread(content, mentions, attachments, references);
			} else {
				console.error('Session is not available');
			}
		},
		[sessionUser],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	return (
		<div className="flex flex-col flex-1 justify-end">
			<div>
				{!currentThread && (
					<div className="flex items-center justify-center mx-4 w-16 h-16 bg-[#26262B] rounded-full pointer-events-none">
						<Icons.ThreadIcon defaultSize="w-7 h-7" />
					</div>
				)}

				{currentThread && (
					<div className="overflow-y-auto bg-[#1E1E1E] max-w-widthMessageViewChat overflow-x-hidden max-h-heightMessageViewChatThread h-heightMessageViewChatThread">
						<ChannelMessages
							channelId={thread?.id as string}
							channelLabel={thread?.chanel_label}
							type={ETypeMessage.THREAD}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						/>
					</div>
				)}
			</div>
			<div className="flex-shrink-0 flex flex-col pb-4 px-4 bg-[#1E1E1E] h-auto relative">
				<MentionReactInput
					onSend={handleSend}
					onTyping={handleTypingDebounced}
					listMentions={UserMentionList(thread?.id as string)}
					isThread
				/>
			</div>
		</div>
	);
};

export default ThreadBox;
