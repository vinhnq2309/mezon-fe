import { GifStickerEmojiPopup, ReactionBottom } from '@mezon/components';
import {
	reactionActions,
	selectCurrentChannelId,
	selectDataSocketUpdate,
	selectIdMessageRefReaction,
	selectReactionBottomState,
	selectReactionBottomStateResponsive,
} from '@mezon/store';
import {
	EmojiDataOptionals,
	IMessageWithUser,
	SenderInfoOptionals,
	calculateTotalCount,
	convertReactionDataFromMessage,
	updateEmojiReactionData,
} from '@mezon/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ItemEmoji from './ItemEmoji';

type MessageReactionProps = {
	message: IMessageWithUser;
	mode: number;
};

const useFilteredReactions = (messageId: string, dataSocketConvert: EmojiDataOptionals[], channeId: string) => {
	return useMemo(() => {
		return dataSocketConvert.filter((item) => item.message_id === messageId && item.channel_id === channeId);
	}, [messageId, dataSocketConvert]);
};

const useConvertedReactions = (message: IMessageWithUser) => {
	return useMemo(() => {
		return message.reactions && message.reactions.length > 0 ? convertReactionDataFromMessage(message) : [];
	}, [message]);
};

const useCombinedReactions = (reactionMessage: EmojiDataOptionals[], reactionSocketByMessageId: EmojiDataOptionals[], currentChannelId: string) => {
	return useMemo(() => {
		const combined = [...reactionMessage, ...reactionSocketByMessageId];
		console.log('combine', combined);
		return updateEmojiReactionData(combined);
	}, [reactionSocketByMessageId, currentChannelId]);
};

const useCheckHasEmoji = (dataReactionCombine: EmojiDataOptionals[]) => {
	return useMemo(() => {
		if (dataReactionCombine.length === 0) return false;
		return calculateTotalCount(dataReactionCombine[0]!.senders) > 0;
	}, [dataReactionCombine]);
};

const useRemoveDuplicate = (objects: EmojiDataOptionals[]): EmojiDataOptionals[] => {
	const seen: { [key: string]: EmojiDataOptionals } = {};
	objects?.forEach((obj) => {
		const key = JSON.stringify({
			senders: obj.senders,
			emoji: obj.emoji,
			channel_id: obj.channel_id,
			message_id: obj.message_id,
		});
		if (!seen[key] || obj.id === '0') {
			seen[key] = obj;
		}
	});
	return Object.values(seen);
};

const extractMessageIds = (data: EmojiDataOptionals[]) => {
	return data.filter((item) => item.senders.some((sender: SenderInfoOptionals) => sender.count && sender.count > 0)).map((item) => item.message_id);
};

const MessageReaction: React.FC<MessageReactionProps> = ({ message, mode }) => {
	const dispatch = useDispatch();
	const smileButtonRef = useRef<HTMLDivElement | null>(null);
	const [showIconSmile, setShowIconSmile] = useState<boolean>(false);
	const reactionBottomState = useSelector(selectReactionBottomState);
	const reactionBottomStateResponsive = useSelector(selectReactionBottomStateResponsive);
	const idMessageRefReaction = useSelector(selectIdMessageRefReaction);
	const dataSocketConvert = useSelector(selectDataSocketUpdate);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const reactionSocketByMessageId = useFilteredReactions(message.id, dataSocketConvert, message.channel_id);
	const reactionMessage = useConvertedReactions(message);
	const dataReactionCombine = useCombinedReactions(reactionMessage, reactionSocketByMessageId, currentChannelId ?? '');
	const checkHasEmoji = useCheckHasEmoji(dataReactionCombine);
	const isMessageMatched = message.id === idMessageRefReaction;

	useEffect(() => {
		const handleDataReaction = updateEmojiReactionData(dataSocketConvert);
		const filter = extractMessageIds(handleDataReaction);
		dispatch(reactionActions.setReactionMessageList(filter));
	}, [dataSocketConvert]);

	return (
		<div className="relative pl-3">
			{isMessageMatched && reactionBottomState && reactionBottomStateResponsive && (
				<div className="w-fit md:hidden z-30 absolute bottom-0 block">
					<div className="scale-75 transform mb-0 z-20">
						<GifStickerEmojiPopup messageEmojiId={message.id} mode={mode} />
					</div>
				</div>
			)}

			<div className="flex gap-2 ml-14">
				<div
					className="w-fit flex flex-wrap gap-2 whitespace-pre-wrap"
					onMouseEnter={() => setShowIconSmile(true)}
					onMouseLeave={() => setShowIconSmile(false)}
				>
					{dataReactionCombine.map((emoji, index) => (
						<ItemEmoji key={`${index}-${message.id}`} message={message} mode={mode} emoji={emoji} />
					))}
					{checkHasEmoji && (
						<div className="w-6 h-6 flex justify-center items-center cursor-pointer relative">
							{showIconSmile && <ReactionBottom messageIdRefReaction={message.id} smileButtonRef={smileButtonRef} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessageReaction;

const x = [
	{
		id: '1808158578675027968',
		emoji: ':verify:',
		senders: [
			{
				sender_id: '1775731111020728320',
				count: 1,
			},
		],
		channel_id: '1808067006121906176',
		message_id: '1808067290831261696',
	},
];

const ip = [
	{
		id: '1808158578675027968',
		emoji: ':verify:',
		senders: [
			{
				sender_id: '1775731111020728320',
				count: 1,
			},
		],
		channel_id: '1808067006121906176',
		message_id: '1808067290831261696',
	},
	{
		id: '0',
		emoji: ':verify:',
		senders: [
			{
				sender_id: '1775731111020728320',
				count: 1,
			},
		],
		channel_id: '1808067006121906176',
		message_id: '1808067290831261696',
	},
	{
		id: '0',
		emoji: ':verify:',
		senders: [
			{
				sender_id: '1784059393956909056',
				count: 1,
			},
		],
		channel_id: '1808067006121906176',
		message_id: '1808067290831261696',
	},
];
