import { useEscapeKey } from '@mezon/core';
import { appActions, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { IChannel } from '@mezon/utils';
import ChannelLayout from '../../layouts/ChannelLayout';

type ChatStreamProps = {
	readonly currentChannel?: Readonly<IChannel> | null;
};

const ChatHeader = ({ currentChannel }: ChatStreamProps) => {
	const dispatch = useAppDispatch();

	const handleCloseModal = () => {
		dispatch(appActions.setIsShowChatStream(false));
	};

	return (
		<div className="flex flex-row items-center justify-between px-4 h-[58px] min-h-[60px] border-b-[1px] dark:border-bgTertiary border-bgLightTertiary">
			<div className="flex flex-row items-center gap-2 pointer-events-none">
				<Icons.Chat defaultSize="w-6 h-6 dark:text-channelTextLabel" />
				<span className="text-base font-semibold dark:text-white text-colorTextLightMode">
					{currentChannel?.channel_label && currentChannel?.channel_label.length > 50
						? `${currentChannel?.channel_label.substring(0, 50)}...`
						: currentChannel?.channel_label}
				</span>
			</div>
			<button onClick={handleCloseModal} className="relative right-0">
				<Icons.Close />
			</button>
		</div>
	);
};

const ChatStream = ({ currentChannel }: ChatStreamProps) => {
	const dispatch = useAppDispatch();

	useEscapeKey(() => dispatch(appActions.setIsShowChatStream(false)));

	return (
		<div className="flex flex-col h-full">
			<ChatHeader currentChannel={currentChannel} />
			<ChannelLayout />
		</div>
	);
};

export default ChatStream;
