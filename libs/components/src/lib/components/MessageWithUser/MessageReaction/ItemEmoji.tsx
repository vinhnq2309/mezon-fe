import { Icons } from '@mezon/components';
import { useAuth, useChatReaction, useEmojiSuggestion } from '@mezon/core';
import { reactionActions, selectCurrentChannel, selectEmojiHover, selectUserReactionPanelState } from '@mezon/store';
import { EmojiDataOptionals, SenderInfoOptionals, calculateTotalCount, getSrcEmoji } from '@mezon/utils';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserReactionPanel from './UserReactionPanel';

type EmojiItemProps = {
	emoji: EmojiDataOptionals;
	mode: number;
};

function ItemEmoji({ emoji, mode }: EmojiItemProps) {
	const dispatch = useDispatch();
	const userId = useAuth();
	const { reactionMessageDispatch } = useChatReaction();
	const userReactionPanelState = useSelector(selectUserReactionPanelState);
	const emojiHover = useSelector(selectEmojiHover);
	const currentChannel = useSelector(selectCurrentChannel);
	const { emojiListPNG } = useEmojiSuggestion();
	const getUrlItem = getSrcEmoji(emoji.emoji ?? '', emojiListPNG);
	const count = calculateTotalCount(emoji.senders);
	const userSenderCount = emoji.senders.find((sender: SenderInfoOptionals) => sender.sender_id === userId.userId)?.count;
	const emojiItemRef = useRef<HTMLDivElement | null>(null);
	const userPanelRef = useRef<HTMLDivElement | null>(null);

	const reactOnExistEmoji = useCallback(
		async (id: string, mode: number, messageId: string, emoji: string, count: number, message_sender_id: string, action_delete: boolean) => {
			await reactionMessageDispatch(
				id,
				mode ?? 2,
				currentChannel?.id ?? '',
				currentChannel?.channel_label ?? '',
				messageId ?? '',
				emoji ?? '',
				1,
				message_sender_id ?? '',
				false,
			);
		},
		[reactionMessageDispatch, currentChannel],
	);

	const [topUserPanel, setTopUserPanel] = useState<any>();
	const [bottomUserPanel, setBottomUserPanel] = useState<any>();
	const [leftUserPanel, setLeftUserPanel] = useState<any>();
	const [rightUserPanel, setRightUserPanel] = useState<any>();
	const [arrowTop, setArrowTop] = useState<boolean>(false);
	const [arrowBottom, setArrowBottom] = useState<boolean>(false);
	const [isRightLimit, setIsRightLimit] = useState<boolean>(false);

	const onHoverEnter = useCallback(() => {
		dispatch(reactionActions.setEmojiHover(emoji));
		dispatch(reactionActions.setUserReactionPanelState(true));
	}, [dispatch, emoji]);

	const onHoverLeave = useCallback(() => {
		resetState();
	}, [dispatch]);

	const resetState = useCallback(() => {
		dispatch(reactionActions.setEmojiHover(null));
		dispatch(reactionActions.setUserReactionPanelState(false));
	}, [dispatch]);

	useEffect(() => {
		if (!userReactionPanelState) {
			resetState();
		}
	}, [userReactionPanelState, resetState]);

	useLayoutEffect(() => {
		if (emojiHover && emojiItemRef.current && userPanelRef) {
			const screenWidth = window.innerWidth;
			const userPanelWidth = userPanelRef.current?.getBoundingClientRect().width;
			const userPanelHeight = userPanelRef.current?.getBoundingClientRect().height;
			const emojiWidth = emojiItemRef.current.getBoundingClientRect().width;
			const emojiHeight = emojiItemRef.current.getBoundingClientRect().height;
			const disLeftEmojiToLeftScreen = emojiItemRef.current.getBoundingClientRect().left;
			const disCenterEmojiToRightScreen = screenWidth - disLeftEmojiToLeftScreen - emojiWidth / 2;
			const disTopEmojiToTopScreen = emojiItemRef.current?.getBoundingClientRect().top;

			if (disCenterEmojiToRightScreen > userPanelWidth! / 2 && disTopEmojiToTopScreen > userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - userPanelWidth! / 2);
				setTopUserPanel(disTopEmojiToTopScreen - userPanelHeight!);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(true);
				setArrowTop(false);
				setIsRightLimit(false);
				return;
			} else if (disCenterEmojiToRightScreen > userPanelWidth! / 2 && disTopEmojiToTopScreen < userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - userPanelWidth! / 2);
				setTopUserPanel(disTopEmojiToTopScreen + emojiHeight);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(false);
				setArrowTop(true);
				setIsRightLimit(false);
				return;
			} else if (disCenterEmojiToRightScreen < userPanelWidth! / 2 && disTopEmojiToTopScreen > userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - emojiWidth / 2);
				setTopUserPanel(disTopEmojiToTopScreen - userPanelHeight!);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(true);
				setArrowTop(false);
				setIsRightLimit(true);
				return;
			} else if (disCenterEmojiToRightScreen < userPanelWidth! / 2 && disTopEmojiToTopScreen < userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - emojiWidth / 2);
				setTopUserPanel(disTopEmojiToTopScreen + emojiHeight);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(false);
				setArrowTop(true);
				setIsRightLimit(true);
				return;
			}
		}
	}, [emojiHover, userPanelRef, userPanelRef.current?.getBoundingClientRect().height]);

	return (
		<>
			{count > 0 && (
				<ItemDetail
					ref={emojiItemRef}
					onMouse={onHoverEnter}
					onLeave={onHoverLeave}
					userSenderCount={userSenderCount ?? NaN}
					onClickReactExist={() =>
						reactOnExistEmoji(emoji.id ?? '', mode, emoji.message_id ?? '', emoji.emoji ?? '', 1, userId.userId ?? '', false)
					}
					getUrlItem={getUrlItem}
					totalCount={count}
				/>
			)}

			{emojiHover?.emoji === emoji.emoji && emojiHover?.message_id === emoji.message_id && userReactionPanelState && count > 0 && (
				<div
					ref={userPanelRef}
					className=" w-[18rem] flex flex-col items-center z-50"
					style={{
						position: 'fixed',
						top: topUserPanel,
						left: leftUserPanel,
						right: rightUserPanel,
						bottom: bottomUserPanel,
					}}
				>
					<ArrowItem arrow={arrowTop} isRightLimit={isRightLimit} emojiCross={emoji} />
					<UserReactionPanel emojiShowPanel={emojiHover!} mode={mode} />
					<ArrowItem arrow={arrowBottom} isRightLimit={isRightLimit} emojiCross={emoji} />
				</div>
			)}
		</>
	);
}

export default ItemEmoji;

type ItemDetailProps = {
	ref: React.RefObject<HTMLDivElement>;
	onMouse: () => void;
	onLeave: () => void;
	userSenderCount: number;
	onClickReactExist: () => void;
	getUrlItem: string;
	totalCount: number;
};
const ItemDetail = forwardRef<HTMLDivElement, ItemDetailProps>(
	({ onMouse, onLeave, userSenderCount, onClickReactExist, getUrlItem, totalCount }, ref) => {
		return (
			<div className="flex flex-row gap-1">
				<div
					ref={ref}
					onMouseEnter={onMouse}
					onMouseLeave={onLeave}
					className={`rounded-md w-fit min-w-12 gap-3 h-6 flex flex-row z-40
					cursor-pointer justify-center items-center relative
					${userSenderCount > 0 ? 'dark:bg-[#373A54] bg-gray-200 border-blue-600 border' : 'dark:bg-[#2B2D31] bg-bgLightMode border-[#313338]'}`}
					onClick={onClickReactExist}
				>
					<span className="absolute left-[5px]">
						<img src={getUrlItem} className="w-4 h-4" alt="Item Icon" />
					</span>
					<div className="text-[13px] top-[2px] ml-5 absolute justify-center text-center cursor-pointer dark:text-white text-black">
						<p>{totalCount}</p>
					</div>
				</div>
			</div>
		);
	},
);

type ArrowItemProps = {
	arrow: boolean;
	isRightLimit: boolean;
	emojiCross: EmojiDataOptionals;
};

function ArrowItem({ arrow, isRightLimit, emojiCross }: ArrowItemProps) {
	const dispatch = useDispatch();
	const onHover = () => {
		dispatch(reactionActions.setEmojiHover(emojiCross));
		dispatch(reactionActions.setUserReactionPanelState(true));
	};
	return (
		<div
			onMouseEnter={onHover}
			className="w-full h-3  z-50 cursor-pointer"
			style={{
				display: 'flex',
				justifyContent: isRightLimit ? 'flex-end' : 'center',
			}}
		>
			{arrow && <Icons.ArrowDownFill className={`dark:text-[#28272b] text-white`} />}
		</div>
	);
}
