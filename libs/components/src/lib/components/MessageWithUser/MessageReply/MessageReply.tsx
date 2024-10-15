import { useShowName } from '@mezon/core';
import { messagesActions, selectMemberClanByUserId, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelMembersEntity, IMessageWithUser } from '@mezon/utils';

import { memo, useCallback, useRef } from 'react';
import { AvatarImage } from '../../AvatarImage/AvatarImage';

import { ChannelStreamMode } from 'mezon-js';
import { useSelector } from 'react-redux';
import { MessageLine } from '../MessageLine';
import { useMessageParser } from '../useMessageParser';
type MessageReplyProps = {
	message: IMessageWithUser;
	mode?: number;
	onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
};

// TODO: refactor component for message lines
const MessageReply: React.FC<MessageReplyProps> = ({ message, onClick, mode }) => {
	const {
		senderIdMessageRef,
		messageContentRef,
		messageUsernameSenderRef,
		messageAvatarSenderRef,
		messageClanNicknameSenderRef,
		messageDisplayNameSenderRef,
		messageIdRef,
		hasAttachmentInMessageRef
	} = useMessageParser(message);
	const messageSender = useSelector(selectMemberClanByUserId(senderIdMessageRef ?? '')) as ChannelMembersEntity;

	const dispatch = useAppDispatch();

	const getIdMessageToJump = useCallback(
		(e: React.MouseEvent<HTMLDivElement | HTMLSpanElement>) => {
			e.stopPropagation();
			if (messageIdRef) {
				dispatch(messagesActions.jumpToMessage({ clanId: message?.clan_id || '', messageId: messageIdRef, channelId: message?.channel_id }));
			}
		},
		[dispatch, message?.channel_id, message?.clan_id, messageIdRef]
	);

	const markUpOnReplyParent = useRef<HTMLDivElement | null>(null);

	const nameShowed = useShowName(
		messageClanNicknameSenderRef ?? '',
		messageDisplayNameSenderRef ?? '',
		messageUsernameSenderRef ?? '',
		senderIdMessageRef ?? ''
	);
	const isDM = mode === ChannelStreamMode.STREAM_MODE_DM || mode == ChannelStreamMode.STREAM_MODE_GROUP;

	return (
		<div className="overflow-hidden " ref={markUpOnReplyParent}>
			{message.references?.[0].message_ref_id ? (
				<div className="rounded flex flex-row gap-1 items-center justify-start w-fit text-[14px] ml-5 mb-[-5px] mt-1 replyMessage">
					<Icons.ReplyCorner />
					<div className="flex flex-row gap-1 mb-2 pr-12 items-center w-full">
						<div className="w-5 h-5">
							<AvatarImage
								className="w-5 h-5"
								alt="user avatar"
								userName={messageUsernameSenderRef}
								src={isDM ? messageAvatarSenderRef : messageSender?.clan_avatar || messageSender?.user?.avatar_url}
							/>
						</div>

						<div className="gap-1 flex flex-row items-center w-full">
							<span
								onClick={onClick}
								className=" text-[#84ADFF] font-bold hover:underline cursor-pointer tracking-wide whitespace-nowrap"
							>
								{isDM ? messageDisplayNameSenderRef || messageUsernameSenderRef : nameShowed}
							</span>
							{hasAttachmentInMessageRef ? (
								<div className=" flex flex-row items-center">
									<div
										onClick={getIdMessageToJump}
										className="text-[14px] pr-1 mr-[-5px] dark:hover:text-white dark:text-[#A8BAB8] text-[#818388]  hover:text-[#060607] cursor-pointer italic   w-fit one-line break-all pt-0"
									>
										Click to see attachment
									</div>
									<Icons.ImageThumbnail />
								</div>
							) : (
								<div>
									{' '}
									<MessageLine
										isEditted={false}
										isTokenClickAble={false}
										isJumMessageEnabled={true}
										onClickToMessage={getIdMessageToJump}
										content={messageContentRef}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="rounded flex flex-row gap-1 items-center justify-start w-fit text-[14px] ml-5 mb-[-5px] mt-1 replyMessage">
					<Icons.ReplyCorner />
					<div className="flex flex-row gap-1 mb-2 pr-12 items-center">
						<div className="rounded-full dark:bg-bgSurface bg-bgLightModeButton size-4">
							<Icons.IconReplyMessDeleted />
						</div>
						<i className="dark:text-zinc-400 text-colorTextLightMode text-[13px]">Original message was deleted</i>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(MessageReply);
