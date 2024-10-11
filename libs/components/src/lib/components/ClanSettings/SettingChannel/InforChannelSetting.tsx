import { useChatMessages } from '@mezon/core';
import { MessagesEntity, selectChannelById, selectOneChannelInfor } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelStatusEnum } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useSelector } from 'react-redux';
import { AvatarUserShort } from '.';
import MessageWithUser from '../../MessageWithUser';

type ChannelSettingItemProps = {
	onClose: () => void;
	channelId: string;
};

const ChannelSettingInforItem = ({ onClose, channelId }: ChannelSettingItemProps) => {
	const channel = useSelector(selectChannelById(channelId));
	const { lastMessage } = useChatMessages({ channelId });

	const channelSetting = useSelector(selectOneChannelInfor(channelId));
	return (
		<div className="fixed w-screen h-screen top-0 left-0 bg-slate-900 bg-opacity-80 z-50 flex items-center flex-row-reverse " onClick={onClose}>
			<div className="w-1/2 h-full bg-white animate-slide_in flex flex-col pt-5 px-5 gap-4" onClick={(e) => e.stopPropagation()}>
				<div className="flex w-full items-center gap-2 shadow-sm ">
					<p className="font-semibold text-xl">{channel.channel_label}</p>
					<div className="h-7 w-7 overflow-hidden flex items-center justify-center ">
						{channel.type === ChannelType.CHANNEL_TYPE_TEXT ? (
							channel.channel_private === ChannelStatusEnum.isPrivate ? (
								<Icons.HashtagLocked defaultSize="w-6 h-6 dark:text-black" />
							) : (
								<Icons.Hashtag defaultSize="w-6 h-6 dark:text-black" />
							)
						) : channel.channel_private === ChannelStatusEnum.isPrivate ? (
							<Icons.ThreadIconLocker />
						) : (
							<Icons.ThreadIcon />
						)}
					</div>
				</div>

				<div className="flex w-full items-start shadow-sm flex-col justify-center">
					<p className="font-semibold text-lg">Last sent</p>
					<LastMessage message={lastMessage} />
				</div>

				<div className="flex w-full items-start shadow-sm flex-col justify-center gap-3">
					<p className="font-semibold text-lg">Member List</p>
					<div className="flex">
						{channel.channel_private === ChannelStatusEnum.isPrivate ? (
							<div className="flex w-full flex-wrap gap-2">
								{channelSetting.user_ids?.map((userId) => <AvatarUserShort id={userId} size="md" />)}
							</div>
						) : (
							<p>(All Member In Clan)</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

type LastMessageProps = {
	message: MessagesEntity | null;
};
const LastMessage = ({ message }: LastMessageProps) => {
	return (
		<div className="w-full h-full flex gap-2">
			<div className="flex-1 flex-col flex">
				<div className="flex flex-col">
					<MessageWithUser
						message={message as MessagesEntity}
						allowDisplayShortProfile={false}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						isHighlight={true}
						isMention={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChannelSettingInforItem;
