import { useChatReaction, useReference } from '@mezon/core';
import { ChannelStreamMode } from '@mezon/mezon-js';
import { AvatarComponent, NameComponent } from '@mezon/ui';
import { EmojiDataOptionals, EmojiPlaces, IMessageWithUser, SenderInfoOptionals } from '@mezon/utils';
import { Fragment, useRef, useState } from 'react';
import { Icons } from '../../components';

type MessageReactionProps = {
	message: IMessageWithUser;
	currentChannelId: string;
	mode: number;
};

// TODO: refactor component for message lines
const MessageReaction = ({ currentChannelId, message, mode }: MessageReactionProps) => {
	const [isHideSmileButton, setIsHideSmileButton] = useState<boolean>(false);
	const {
		userId,
		reactionMessageDispatch,
		setReactionPlaceActive,
		reactionBottomState,
		grandParentWidth,
		dataReactionCombine,
		setReactionRightState,
		setReactionBottomState,
	} = useChatReaction();

	const { referenceMessage, setReferenceMessage } = useReference();

	const calculateDistance = (index: number, bannerWidth: number) => {
		if (childRef.current && grandParentWidth) {
			const childDivRef = childRef.current[index];
			if (childDivRef) {
				const childDivRect = childDivRef.getBoundingClientRect();
				const compare = childDivRect.right + bannerWidth > grandParentWidth;
				return compare;
			}
		}
	};

	const removeEmojiSender = async (id: string, messageId: string, emoji: string, message_sender_id: string, countRemoved: number) => {
		setIsHideSmileButton(true);
		await reactionMessageDispatch(id, mode, messageId, emoji, countRemoved, message_sender_id, true);
	};

	const hideSenderOnPanel = (emojiData: EmojiDataOptionals, senderId: string) => {
		if (emojiData.senders) {
			emojiData.senders = emojiData.senders.filter((sender) => sender.sender_id !== senderId);
		}
		return emojiData;
	};

	async function reactOnExistEmoji(
		id: string,
		mode: number,
		messageId: string,
		emoji: string,
		count: number,
		message_sender_id: string,
		action_delete: boolean,
	) {
		await reactionMessageDispatch('', mode ?? 2, messageId ?? '', emoji ?? '', 1, message_sender_id ?? '', false);
	}

	const calculateTotalCount = (senders: SenderInfoOptionals[]) => {
		return senders.reduce((sum: number, item: SenderInfoOptionals) => sum + (item.count ?? 0), 0);
	};

	const [isHovered, setIsHovered] = useState(false);
	const childRef = useRef<(HTMLDivElement | null)[]>([]);

	const handleClickOpenEmojiBottom = (event: React.MouseEvent<HTMLDivElement>) => {
		setReactionRightState(true);
		setReferenceMessage(message);
		setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_BOTTOM);
		setReactionBottomState(false);
		event.stopPropagation();
	};

	const [isHoverSender, setIsHoverSender] = useState<boolean>(false);
	const [isEmojiHover, setEmojiHover] = useState<any>();
	const getEmojiHover = (emojiParam: any) => {
		setIsHoverSender(true);
		setEmojiHover(emojiParam);
		setIsHideSmileButton(false);
	};

	const PANEL_SENDER_WIDTH = 288;

	return (
		<div className="flex flex-wrap  gap-2 whitespace-pre-wrap ml-14">
			{dataReactionCombine
				.filter((emojiFilter: EmojiDataOptionals) => emojiFilter.message_id === message.id)
				?.map((emoji: EmojiDataOptionals, index: number) => {
					const isRightMargin = calculateDistance(index, PANEL_SENDER_WIDTH);
					const totalSenderCount = emoji.senders.reduce((sum: number, sender: SenderInfoOptionals) => sum + (sender.count ?? 0), 0);
					const shouldHideEmoji = Math.abs(totalSenderCount) === 0;
					const userSender = emoji.senders.find((sender: SenderInfoOptionals) => sender.sender_id === userId);
					const checkID = emoji.message_id === message.id;

					if (shouldHideEmoji) {
						return null;
					}
					return (
						<div key={index}>
							{checkID && (
								<div
									ref={(element) => (childRef.current[index] = element)}
									className={` justify-center items-center relative
									${userSender?.count && userSender.count > 0 ? 'bg-[#373A54] border-blue-600 border' : 'bg-[#313338] border-[#313338]'}
									rounded-md w-fit min-w-12 gap-3 h-6 flex flex-row  items-center cursor-pointer`}
									onClick={() =>
										reactOnExistEmoji(
											emoji.id ?? '',
											ChannelStreamMode.STREAM_MODE_CHANNEL,
											message.id ?? '',
											emoji.emoji ?? '',
											1,
											userId ?? '',
											false,
										)
									}
									onMouseEnter={() => {
										return getEmojiHover(emoji);
									}}
									onMouseLeave={() => {
										setIsHoverSender(false);
									}}
								>
									<span className=" relative left-[-10px] ">{emoji.emoji}</span>
									<div className="text-[13px] top-[2px] ml-5 absolute justify-center text-center cursor-pointer">
										<p>{calculateTotalCount(emoji.senders)}</p>
									</div>

									{!isHideSmileButton && dataReactionCombine.indexOf(emoji) === dataReactionCombine.length - 1 && (
										<div onMouseEnter={() => setIsHovered(true)} className="absolute w-4 h-4">
											<div className="bg-transparent w-8 flex flex-row items-center rounded-md cursor-pointer"></div>
											<div
												onClick={handleClickOpenEmojiBottom}
												className={`bg-[#313338] border-[#313338] w-8 border px-2 flex flex-row items-center rounded-md cursor-pointer ml-[2.5rem] h-6 absolute bottom-[-0.25rem]
													${(reactionBottomState && message.id === referenceMessage?.id) || isHovered ? 'block' : 'hidden'} `}
												onMouseEnter={() => setIsHoverSender(false)}
											>
												<Icons.Smile
													defaultSize="w-4 h-4"
													defaultFill={reactionBottomState && message.id === referenceMessage?.id ? '#FFFFFF' : '#AEAEAE'}
												/>
											</div>
										</div>
									)}

									{isHoverSender && emoji.emoji === isEmojiHover.emoji && emoji.message_id === message.id && (
										<div
											onMouseLeave={() => {
												setIsHoverSender(false);
											}}
											onClick={(e) => e.stopPropagation()}
											className={`absolute z-20  bottom-7 w-[18rem]
											bg-[#313338] border-[#313338] rounded-md min-h-5 max-h-[25rem] border ${isRightMargin ? 'right-0' : 'left-0'}`}
										>
											<div className="flex flex-row items-center m-2">
												<div className="">{isEmojiHover.emoji}</div>
												<p className="text-sm">{calculateTotalCount(emoji.senders)}</p>
												<button
													className="right-3 absolute"
													onClick={(e) => {
														e.stopPropagation();
														setIsHoverSender(false);
													}}
												>
													<Icons.Close defaultSize="w-3 h-3" />
												</button>
											</div>

											<hr className="h-[0.1rem] bg-blue-900 border-none"></hr>
											{isEmojiHover.senders.map((item: SenderInfoOptionals, index: number) => {
												return (
													<Fragment key={index}>
														{item.count && item.count > 0 && (
															<div
																key={item.sender_id}
																className="m-2 flex flex-row  justify-start mb-2 items-center gap-2 relative "
															>
																<AvatarComponent id={item.sender_id ?? ''} />
																<NameComponent id={item.sender_id ?? ''} />
																<p className="text-xs absolute right-8">{item.count}</p>
																{item.sender_id === userId && (
																	<button
																		onClick={(e: any) => {
																			return (
																				e.stopPropagation(),
																				removeEmojiSender(
																					emoji.id ?? '',
																					message.id,
																					emoji.emoji ?? '',
																					item.sender_id ?? '',
																					item.count ?? 0,
																				),
																				hideSenderOnPanel(emoji, item.sender_id ?? '')
																			);
																		}}
																		className="right-1 absolute"
																	>
																		<Icons.Close defaultSize="w-3 h-3" />
																	</button>
																)}
															</div>
														)}
													</Fragment>
												);
											})}
											<div className="w-full h-3 absolute bottom-[-0.5rem]"></div>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
		</div>
	);
};

export default MessageReaction;
