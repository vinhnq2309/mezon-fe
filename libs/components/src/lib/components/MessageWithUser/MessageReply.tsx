import { messagesActions, referencesActions, selectMemberByUserId, selectMessageByMessageId } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Icons from '../Icons/index';

type MessageReplyProps = {
	message: IMessageWithUser;
};

// TODO: refactor component for message lines
const MessageReply = ({ message }: MessageReplyProps) => {
	const [messageRefId, setMessageId] = useState('');
	const [senderId, setSenderId] = useState('');
	const messageRefFetchFromServe = useSelector(selectMessageByMessageId(messageRefId));
	const senderMessage = useSelector(selectMemberByUserId(senderId));
	const dispatch = useDispatch();

	useEffect(() => {
		if (message.references && message.references.length > 0) {
			const messageReferenceId = message.references[0].message_ref_id;
			const messageReferenceUserId = message.references[0].message_sender_id;
			setMessageId(messageReferenceId ?? '');
			setSenderId(messageReferenceUserId ?? '');
			dispatch(messagesActions.setReplyMessageStatus(true));
		}
	}, [message]);

	const getIdMessageToJump = (idRefMessage: string) => {
		if (idRefMessage) {
			dispatch(referencesActions.setIdMessageToJump(idRefMessage));
		}
	};

	return (
		<div>
			{messageRefFetchFromServe && senderMessage && message.references && message?.references.length > 0 && (
				<div className="rounded flex flex-row gap-1 items-center justify-start w-fit text-[14px] ml-5 mb-[-5px] mt-1 replyMessage">
					<Icons.ReplyCorner />
					<div className="flex flex-row gap-1 mb-2 pr-12 items-center">
						<div className="w-5 h-5">
							<img
								className="rounded-full min-w-5 max-h-5 object-cover"
								src={senderMessage?.user && senderMessage.user?.avatar_url}
								alt={senderMessage?.user && senderMessage.user?.avatar_url}
							></img>
						</div>

						<div className="gap-1 flex flex-row items-center">
							<span className=" text-[#84ADFF] font-bold hover:underline cursor-pointer tracking-wide">
								@{senderMessage.user?.username}{' '}
							</span>
							{message.references[0].has_attachment ? (
								<div className=" flex flex-row items-center">
									<button
										onClick={() => getIdMessageToJump(messageRefId)}
										className="text-[13px] font-manrope pr-1 mr-[-5px] hover:text-white cursor-pointer italic text-[#A8BAB8] w-fit one-line break-all pt-1"
									>
										Click to see attachment
									</button>
									<Icons.ImageThumbnail />
								</div>
							) : (
								<span className="text-[13px] font-manrope hover:text-white cursor-pointer text-[#A8BAB8] one-line break-all pt-1">
									{messageRefFetchFromServe.content && messageRefFetchFromServe.content.t}
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessageReply;
