import { MessageReaction } from '@mezon/components';
import { selectCurrentChannelId } from '@mezon/store';
import { IChannelMember, IMessageWithUser, TIME_COMBINE, checkSameDay, getTimeDifferenceInSeconds } from '@mezon/utils';
import { useMemo, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import * as Icons from '../Icons/index';
import MessageAttachment from './MessageAttachment';
import MessageAvatar from './MessageAvatar';
import MessageHead from './MessageHead';
import MessageReply from './MessageReply';
import { useMessageParser } from './useMessageParser';

import { useReference } from '@mezon/core';
import React from 'react';
import { useSelector } from 'react-redux';
import MessageContent from './MessageContent';

export type ReactedOutsideOptional = {
	id: string;
	emoji?: string;
	messageId: string;
};

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	user?: IChannelMember | null;
	isMessNotifyMention?: boolean;
	mode: number;
	newMessage?: string;
	child?: JSX.Element;
	isMention?: boolean;
};

function MessageWithUser({ message, preMessage, user, isMessNotifyMention, mode, newMessage, child, isMention }: MessageWithUserProps) {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { messageDate } = useMessageParser(message);
	const divMessageWithUser = useRef<HTMLDivElement>(null);
	const { referenceMessage, openReplyMessageState, idMessageReplied } = useReference();
	const isCombine = useMemo(() => {
		const timeDiff = getTimeDifferenceInSeconds(preMessage?.create_time as string, message?.create_time as string);
		return (
			timeDiff < TIME_COMBINE &&
			preMessage?.user?.id === message?.user?.id &&
			checkSameDay(preMessage?.create_time as string, message?.create_time as string)
		);
	}, [message, preMessage]);

	const attachments = useMemo(() => {
		return message.attachments;
	}, [message.attachments]);

	const propsChild = { isCombine };
	const checkReplied = referenceMessage && referenceMessage.id === message.id;
	const checkMessageTargetToMoved = idMessageReplied === message.id;

	return (
		<>
			{!checkSameDay(preMessage?.create_time as string, message?.create_time as string) && !isMessNotifyMention && (
				<div className="flex flex-row w-full px-4 items-center pt-3 text-zinc-400 text-[12px] font-[600] bg-[#26262B]">
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
					<span className="text-center px-3 whitespace-nowrap">{messageDate}</span>
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
				</div>
			)}
			<div className={`relative ${isCombine ? '' : 'mt-2'}`}>
				<div
					className={`bg-[#26262b] relative rounded-sm  overflow-visible ${(checkReplied && openReplyMessageState) || (checkMessageTargetToMoved && openReplyMessageState) ? 'bg-[#393C47] group-hover:none' : 'bg-[#26262b]'}`}
				>
					<div
						className={`${(checkReplied && openReplyMessageState) || (checkMessageTargetToMoved && openReplyMessageState) ? ' bg-blue-500 group-hover:none' : 'bg-[#26262b] group-hover:bg-[#232323]'} absolute w-1 h-full left-0`}
					></div>
					<div
						className={`flex h-15 flex-col w-auto px-3 py-1  group-hover:bg-[#232323] ${isMention ? 'mt-0 py-2' : isCombine ? '' : 'pt-[4px]'}`}
					>
						<MessageReply message={message} />
						<div className="justify-start gap-4 inline-flex w-full relative h-fit overflow-visible pr-12" ref={divMessageWithUser}>
							<MessageAvatar user={user} message={message} isCombine={isCombine} />
							<div className="w-full relative h-full">
								<MessageHead message={message} user={user} isCombine={isCombine} />
								<div className={`justify-start items-center inline-flex w-full h-full ${isCombine ? '' : 'pt-1'} textChat`}>
									<div
										className="flex flex-col text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px] w-fit cursor-text"
										style={{ wordBreak: 'break-word' }}
									>
										<MessageContent message={message} user={user} isCombine={isCombine} newMessage={newMessage} />
									</div>
								</div>
								<MessageAttachment attachments={attachments} />
							</div>
						</div>

						<MessageReaction currentChannelId={currentChannelId || ''} message={message} mode={mode} />
						{message && !isMessNotifyMention && (
							<div
								className={`absolute top-[100] right-2 flex-row items-center gap-x-1 text-xs text-gray-600 ${isCombine ? 'hidden' : 'flex'}`}
							>
								<Icons.Sent />
							</div>
						)}
					</div>
				</div>
				{child && React.isValidElement(child) && React.cloneElement(child, propsChild)}
			</div>
		</>
	);
}

MessageWithUser.Skeleton = () => {
	return (
		<div className="flex py-0.5 min-w-min mx-3 h-15 mt-3 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer  flex-shrink-1">
			<Skeleton circle={true} width={38} height={38} />
		</div>
	);
};

export default MessageWithUser;
