import {
	useChannelMembers,
	useChannels,
	useClickUpToEdit,
	useEmojiSuggestion,
	useGifsStickersEmoji,
	useMessageValue,
	useReference,
	useSearchMessages,
	useThreads,
} from '@mezon/core';
import {
	ChannelsEntity,
	channelUsersActions,
	messagesActions,
	reactionActions,
	referencesActions,
	selectAllAccount,
	selectAllDirectChannelVoids,
	selectAllUsesClan,
	selectAttachmentData,
	selectCloseMenu,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectDataReferences,
	selectDmGroupCurrentId,
	selectIdMessageRefReply,
	selectIsFocused,
	selectIsShowMemberList,
	selectIsShowMemberListDM,
	selectIsUseProfileDM,
	selectLassSendMessageEntityBySenderId,
	selectMessageByMessageId,
	selectOpenEditMessageState,
	selectOpenReplyMessageState,
	selectOpenThreadMessageState,
	selectReactionRightState,
	selectStatusMenu,
	selectTheme,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
import {
	ChannelMembersEntity,
	EmojiPlaces,
	IEmojiOnMessage,
	IHashtagOnMessage,
	ILineMention,
	ILinkOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage,
	IMessageSendPayload,
	MIN_THRESHOLD_CHARS,
	MentionDataProps,
	SubPanelName,
	ThreadValue,
	UsersClanEntity,
	emojiRegex,
	focusToElement,
	linkRegex,
	neverMatchingRegex,
	searchMentionsHashtag,
	threadError,
	uniqueUsers,
} from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { KeyboardEvent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import { useSelector } from 'react-redux';
import textFieldEdit from 'text-field-edit';
import { Icons, ThreadNameTextField } from '../../../components';
import PrivateThread from '../../ChannelTopbar/TopBarComponents/Threads/CreateThread/PrivateThread';
import { useMessageLine } from '../../MessageWithUser/useMessageLine';
import ChannelMessageThread from './ChannelMessageThread';
import CustomModalMentions from './CustomModalMentions';
import {
	defaultMaxWidth,
	maxWidthWithChatThread,
	maxWidthWithDmGroupMemberList,
	maxWidthWithDmUserProfile,
	maxWidthWithMemberList,
	maxWidthWithSearchMessage,
	widthDmGroupMemberList,
	widthDmUserProfile,
	widthMessageViewChat,
	widthMessageViewChatThread,
	widthSearchMessage,
	widthThumbnailAttachment,
} from './CustomWidth';
import lightMentionsInputStyle from './LightRmentionInputStyle';
import darkMentionsInputStyle from './RmentionInputStyle';
import mentionStyle from './RmentionStyle';
import SuggestItem from './SuggestItem';

import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { Node, Parent } from 'unist';
interface PositionTracker {
	[key: string]: number;
}

type ChannelsMentionProps = {
	id: string;
	display: string;
	subText: string;
};

type EmojiData = {
	id: string;
	emoji: string;
	display: string;
};

export type MentionReactInputProps = {
	readonly onSend: (
		content: IMessageSendPayload,
		mentions?: Array<ApiMessageMention>,
		attachments?: Array<ApiMessageAttachment>,
		references?: Array<ApiMessageRef>,
		value?: ThreadValue,
		anonymousMessage?: boolean,
		mentionEveryone?: boolean,
	) => void;
	readonly onTyping?: () => void;
	readonly listMentions?: MentionDataProps[] | undefined;
	readonly isThread?: boolean;
	readonly handlePaste?: any;
	readonly handleConvertToFile?: (valueContent: string) => void | undefined;
	readonly currentClanId?: string;
	readonly currentChannelId?: string;
	readonly mode?: number;
};

function MentionReactInput(props: MentionReactInputProps): ReactElement {
	const { listChannels } = useChannels();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const dispatch = useAppDispatch();
	const { setDataReferences, setOpenThreadMessageState, setAttachmentData } = useReference();
	const dataReferences = useSelector(selectDataReferences);
	const openThreadMessageState = useSelector(selectOpenThreadMessageState);
	const idMessageRefReply = useSelector(selectIdMessageRefReply);
	const { setSubPanelActive } = useGifsStickersEmoji();
	const commonChannelVoids = useSelector(selectAllDirectChannelVoids);
	const getRefMessageReply = useSelector(selectMessageByMessageId(idMessageRefReply));
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);

	const [mentionsOnMessage, setMentionsOnMessage] = useState<IMentionOnMessage[]>([]);
	const [hashtagsOnMessage, setHashtagsOnMessage] = useState<IHashtagOnMessage[]>([]);
	const [emojisOnMessage, setEmojisOnMessage] = useState<IEmojiOnMessage[]>([]);
	const [linksOnMessage, setLinksOnMessage] = useState<ILinkOnMessage[]>([]);
	const [markdownsOnMessage, setMarkdownsOnMessage] = useState<IMarkdownOnMessage[]>([]);
	const [plainTextMessage, setPlainTextMessage] = useState<string>();

	const mentionList: IMentionOnMessage[] = [];
	const hashtagList: IHashtagOnMessage[] = [];
	const emojiList: IEmojiOnMessage[] = [];
	const linkList: ILinkOnMessage[] = [];
	const markdownList: IMarkdownOnMessage[] = [];

	const [mentionEveryone, setMentionEveryone] = useState(false);
	const { members } = useChannelMembers({ channelId: currentChannelId });
	const attachmentDataRef = useSelector(selectAttachmentData);
	const [content, setContent] = useState('');
	const { threadCurrentChannel, messageThreadError, isPrivate, nameValueThread, valueThread, isShowCreateThread } = useThreads();
	const currentChannel = useSelector(selectCurrentChannel);
	const { mentions } = useMessageLine(content);
	const usersClan = useSelector(selectAllUsesClan);
	const { emojis } = useEmojiSuggestion();
	const { emojiPicked, addEmojiState } = useEmojiSuggestion();
	const reactionRightState = useSelector(selectReactionRightState);
	const isFocused = useSelector(selectIsFocused);
	const isShowMemberList = useSelector(selectIsShowMemberList);
	const isShowMemberListDM = useSelector(selectIsShowMemberListDM);
	const isShowDMUserProfile = useSelector(selectIsUseProfileDM);
	const { isSearchMessage } = useSearchMessages();
	const currentDmId = useSelector(selectDmGroupCurrentId);

	const userProfile = useSelector(selectAllAccount);
	const lastMessageByUserId = useSelector((state) =>
		selectLassSendMessageEntityBySenderId(
			state,
			props.mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? currentChannel?.channel_id : currentDmId,
			userProfile?.user?.id,
		),
	);

	const { valueTextInput, setValueTextInput } = useMessageValue(
		props.isThread ? currentChannelId + String(props.isThread) : (currentChannelId as string),
	);
	const [valueHighlight, setValueHightlight] = useState<string>('');
	const [titleModalMention, setTitleModalMention] = useState('');

	const queryEmojis = (query: string, callback: (data: any[]) => void) => {
		if (query.length === 0) return;
		const matches = emojis
			.filter((emoji) => emoji.shortname && emoji.shortname.indexOf(query.toLowerCase()) > -1)
			.slice(0, 20)
			.map((emojiDisplay) => ({ id: emojiDisplay?.shortname, display: emojiDisplay?.shortname }));
		callback(matches);
	};

	const onKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>): Promise<void> => {
		const { key, ctrlKey, shiftKey } = event;
		const isEnterKey = key === 'Enter';

		if (isEnterKey && ctrlKey && shiftKey) {
			event.preventDefault();
			if (valueTextInput !== '' || openThreadMessageState) {
				if (props.currentClanId) {
					handleSend(true);
				}
				return;
			}
		}

		switch (key) {
			case 'Enter': {
				if (shiftKey) {
					return;
				} else {
					event.preventDefault();
					handleSend(false);
					return;
				}
			}
			default: {
				return;
			}
		}
	};

	const addMemberToChannel = useCallback(
		async (currentChannel: ChannelsEntity | null, mentions: ILineMention[], userClans: UsersClanEntity[], members: ChannelMembersEntity[]) => {
			const userIds = uniqueUsers(mentions, userClans, members);
			const body = {
				channelId: currentChannel?.channel_id as string,
				channelType: currentChannel?.type,
				userIds: userIds,
			};
			if (userIds.length > 0) {
				await dispatch(channelUsersActions.addChannelUsers(body));
			}
		},
		[dispatch],
	);

	const editorRef = useRef<HTMLInputElement | null>(null);
	const openReplyMessageState = useSelector(selectOpenReplyMessageState);
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const closeMenu = useSelector(selectCloseMenu);
	const statusMenu = useSelector(selectStatusMenu);

	const handleSend = useCallback(
		(anonymousMessage?: boolean) => {
			if ((!valueTextInput && attachmentDataRef?.length === 0) || ((valueTextInput || '').trim() === '' && attachmentDataRef?.length === 0)) {
				return;
			}
			if (
				valueTextInput &&
				typeof valueTextInput === 'string' &&
				!(valueTextInput || '').trim() &&
				attachmentDataRef?.length === 0 &&
				mentionData?.length === 0
			) {
				if (!nameValueThread?.trim() && props.isThread && !threadCurrentChannel) {
					dispatch(threadsActions.setMessageThreadError(threadError.message));
					dispatch(threadsActions.setNameThreadError(threadError.name));
					return;
				}
				if (props.isThread && !threadCurrentChannel) {
					dispatch(threadsActions.setMessageThreadError(threadError.message));
				}
				return;
			}

			if (!nameValueThread?.trim() && props.isThread && !threadCurrentChannel && !openThreadMessageState) {
				dispatch(threadsActions.setNameThreadError(threadError.name));
				return;
			}

			if (getRefMessageReply !== null && dataReferences && dataReferences.length > 0 && openReplyMessageState) {
				props.onSend(
					{
						t: content,
						mentions: mentionsOnMessage,
						hashtags: hashtagsOnMessage,
						emojis: emojisOnMessage,
						links: linksOnMessage,
						markdowns: markdownsOnMessage,
						plainText: plainTextMessage,
					},
					mentionData,
					attachmentDataRef,
					dataReferences,
					{ nameValueThread: nameValueThread, isPrivate },
					anonymousMessage,
					mentionEveryone,
				);
				addMemberToChannel(currentChannel, mentions, usersClan, members);
				setValueTextInput('', props.isThread);
				setAttachmentData([]);
				dispatch(referencesActions.setIdReferenceMessageReply(''));
				dispatch(referencesActions.setOpenReplyMessageState(false));
				setMentionEveryone(false);
				setDataReferences([]);
				dispatch(threadsActions.setNameValueThread({ channelId: currentChannelId as string, nameValue: '' }));
				setContent('');
				setMentionData([]);
				dispatch(threadsActions.setIsPrivate(0));
			} else {
				if (openThreadMessageState) {
					props.onSend(
						{ t: valueThread?.content.t || '', contentThread: content },
						valueThread?.mentions,
						valueThread?.attachments,
						valueThread?.references,
						{ nameValueThread: nameValueThread ?? valueThread?.content.t, isPrivate },
						anonymousMessage,
						mentionEveryone,
					);
					setOpenThreadMessageState(false);
				} else {
					props.onSend(
						{
							t: content.trim(),
							mentions: mentionsOnMessage,
							hashtags: hashtagsOnMessage,
							emojis: emojisOnMessage,
							links: linksOnMessage,
							markdowns: markdownsOnMessage,
							plainText: plainTextMessage,
						},
						mentionData,
						attachmentDataRef,
						undefined,
						{ nameValueThread: nameValueThread, isPrivate },
						anonymousMessage,
						mentionEveryone,
					);
				}
				addMemberToChannel(currentChannel, mentions, usersClan, members);
				setValueTextInput('', props.isThread);
				setMentionEveryone(false);
				setAttachmentData([]);
				dispatch(threadsActions.setNameValueThread({ channelId: currentChannelId as string, nameValue: '' }));
				setContent('');
				setMentionData([]);
				dispatch(threadsActions.setIsPrivate(0));
			}
			dispatch(referencesActions.setOpenReplyMessageState(false));
			dispatch(reactionActions.setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE));
			setSubPanelActive(SubPanelName.NONE);

			setMentionsOnMessage([]);
			setHashtagsOnMessage([]);
			setEmojisOnMessage([]);
			setLinksOnMessage([]);
			setMarkdownsOnMessage([]);
			setMentionData([]);
		},
		[
			valueTextInput,
			attachmentDataRef,
			mentionData,
			nameValueThread,
			props,
			threadCurrentChannel,
			openThreadMessageState,
			getRefMessageReply,
			dataReferences,
			openReplyMessageState,
			dispatch,
			setSubPanelActive,
			content,
			isPrivate,
			mentionEveryone,
			addMemberToChannel,
			currentChannel,
			mentions,
			usersClan,
			members,
			setValueTextInput,
			setAttachmentData,
			setDataReferences,
			currentChannelId,
			valueThread?.content.t,
			valueThread?.mentions,
			valueThread?.attachments,
			valueThread?.references,
			setOpenThreadMessageState,
		],
	);

	const listChannelsMention: ChannelsMentionProps[] = useMemo(() => {
		if (props.mode !== 3 && props.mode !== 4) {
			return listChannels.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.category_name ?? '',
				};
			}) as ChannelsMentionProps[];
		}
		return [];
	}, [props.mode, listChannels]);

	const listChannelVoidsMention: ChannelsMentionProps[] = useMemo(() => {
		if (props.mode === ChannelStreamMode.STREAM_MODE_DM) {
			return commonChannelVoids.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.clan_name ?? '',
				};
			}) as ChannelsMentionProps[];
		}
		return [];
	}, [props.mode, commonChannelVoids]);

	const onChangeMentionInput: OnChangeHandlerFunc = (event, newValue, newPlainTextValue, mentions) => {
		dispatch(threadsActions.setMessageThreadError(''));
		setValueTextInput(newValue, props.isThread);

		if (typeof props.onTyping === 'function') {
			props.onTyping();
		}

		const convertedHashtag = convertToPlainTextHashtag(newValue);
		setContent(convertedHashtag);
		setPlainTextMessage(newPlainTextValue);
		let match;
		while ((match = emojiRegex.exec(convertedHashtag)) !== null) {
			emojiList.push({
				shortname: match[0],
				startIndex: match.index,
				endIndex: match.index + match[0].length,
			});
		}
		setEmojisOnMessage(emojiList);

		while ((match = linkRegex.exec(convertedHashtag)) !== null) {
			linkList.push({
				link: match[0],
				startIndex: match.index,
				endIndex: match.index + match[0].length,
			});
		}
		setLinksOnMessage(linkList);

		// Phân tích cú pháp Markdown thành AST
		const tree = unified().use(remarkParse).parse(convertedHashtag);
		console.log('tree', tree);
		// Định nghĩa kiểu cho phần tử trong mảng indices

		// Kiểm tra nếu một nút có thuộc tính children
		function isParent(node: Node): node is Parent {
			return (node as Parent).children !== undefined;
		}

		// Kiểm tra nếu một nút là loại `root`, `paragraph`, hoặc `text`
		function isExcludedNode(node: Node): boolean {
			return ['root', 'paragraph', 'text', 'listItem'].includes(node.type);
		}

		// Hàm tính toán chỉ số startIndex và endIndex cho các phần tử trong AST
		// Hàm tính toán chỉ số startIndex và endIndex cho các phần tử trong AST
		function calculateIndices(node: Node, text: string, indices: IMarkdownOnMessage[] = []): IMarkdownOnMessage[] {
			if (node.position && !isExcludedNode(node)) {
				const { start, end } = node.position;
				indices.push({
					type: node.type,
					markdown: text.slice(start.offset, end.offset),
					startIndex: start.offset,
					endIndex: end.offset,
				});
			}

			if (isParent(node)) {
				node.children.forEach((child: Node) => calculateIndices(child, text, indices));
			}

			return indices;
		}

		const indices = calculateIndices(tree, convertedHashtag);

		console.log(indices);

		setMarkdownsOnMessage(indices);

		// while ((match = markdownRegex.exec(convertedHashtag)) !== null) {
		// 	const startsWithTripleBackticks = match[0].startsWith('```');
		// 	const endsWithNoTripleBackticks = match[0].endsWith('```');
		// 	const convertedMarkdown = startsWithTripleBackticks && endsWithNoTripleBackticks ? convertMarkdown(match[0]) : match[0];
		// 	markdownList.push({
		// 		markdown: convertedMarkdown,
		// 		startIndex: match.index,
		// 		endIndex: match.index + match[0].length,
		// 	});
		// }
		// setMarkdownsOnMessage(markdownList);

		if (mentions.length > 0) {
			if (mentions.some((mention) => mention.display === '@here')) {
				setMentionEveryone(true);
			}
			let positionTracker: PositionTracker = {};

			for (const mention of mentions) {
				let startIndex = -1;
				let endIndex = -1;
				if (mention.display.startsWith('@')) {
					if (!positionTracker[mention.display]) {
						positionTracker[mention.display] = 0;
					}
					startIndex = convertedHashtag.indexOf(mention.display, positionTracker[mention.display]);
					endIndex = startIndex + mention.display.length;
					positionTracker[mention.display] = endIndex;
					mentionList.push({
						userId: mention.id.toString() ?? '',
						username: mention.display ?? '',
						startIndex: startIndex,
						endIndex: endIndex,
					});
				}

				if (mention.display.startsWith('#')) {
					const hashtagPattern = `<#${mention.id.toString()}>`;

					if (positionTracker[hashtagPattern] === undefined) {
						positionTracker[hashtagPattern] = 0;
					}
					startIndex = convertedHashtag.indexOf(hashtagPattern, positionTracker[hashtagPattern]);
					endIndex = startIndex + hashtagPattern.length;

					positionTracker[hashtagPattern] = endIndex;

					hashtagList.push({
						channelId: mention.id.toString() ?? '',
						channelLable: mention.display ?? '',
						startIndex: startIndex,
						endIndex: endIndex,
					});
				}
			}

			setMentionsOnMessage(mentionList);
			setHashtagsOnMessage(hashtagList);
			const simplifiedMentionList = mentionList.map((mention) => ({
				user_id: mention.userId,
				username: mention.username,
			}));
			setMentionData(simplifiedMentionList);
		}

		if (props.handleConvertToFile !== undefined && convertedHashtag.length > MIN_THRESHOLD_CHARS) {
			props.handleConvertToFile(convertedHashtag);
			setContent('');
			setValueTextInput('');
		}

		if (newPlainTextValue.endsWith('@')) {
			setTitleModalMention('Members');
		} else if (newPlainTextValue.endsWith('#')) {
			setTitleModalMention('Text channels');
		} else if (newPlainTextValue.endsWith(':')) {
			setTitleModalMention('Emoji matching');
		}
	};

	const handleChangeNameThread = (nameThread: string) => {
		dispatch(threadsActions.setNameValueThread({ channelId: currentChannelId as string, nameValue: nameThread }));
	};

	const convertToPlainTextHashtag = (text: string) => {
		const regex = /([@#])\[(.*?)\]\((.*?)\)/g;
		const result = text.replace(regex, (match, symbol, p1, p2) => {
			return symbol === '#' ? `<#${p2}>` : `@${p1}`;
		});
		return result;
	};

	const input = document.querySelector('#editorReactMention') as HTMLElement;
	function handleEventAfterEmojiPicked() {
		if (!emojiPicked || !input) {
			return;
		}
		textFieldEdit.insert(input, emojiPicked);
	}

	const clickUpToEditMessage = () => {
		const idRefMessage = lastMessageByUserId?.id;
		if (idRefMessage && !valueTextInput) {
			dispatch(referencesActions.setIdMessageToJump(idRefMessage));
			dispatch(referencesActions.setOpenEditMessageState(true));
			dispatch(referencesActions.setOpenReplyMessageState(false));
			dispatch(referencesActions.setIdReferenceMessageEdit(lastMessageByUserId));
			dispatch(referencesActions.setIdReferenceMessageEdit(idRefMessage));
		}
	};

	const appearanceTheme = useSelector(selectTheme);

	const handleSearchUserMention = (search: any, callback: any) => {
		setValueHightlight(search);
		callback(searchMentionsHashtag(search, props.listMentions ?? []));
	};

	const handleSearchHashtag = (search: any, callback: any) => {
		setValueHightlight(search);
		if (props.mode === ChannelStreamMode.STREAM_MODE_DM) {
			callback(searchMentionsHashtag(search, listChannelVoidsMention ?? []));
		} else {
			callback(searchMentionsHashtag(search, listChannelsMention ?? []));
		}
	};

	useClickUpToEdit(editorRef, valueTextInput, clickUpToEditMessage);

	useEffect(() => {
		if (closeMenu && statusMenu) {
			return;
		}
		if ((getRefMessageReply !== null && openReplyMessageState) || !openEditMessageState || (emojiPicked !== '' && !reactionRightState)) {
			return focusToElement(editorRef);
		}
	}, [getRefMessageReply, openReplyMessageState, openEditMessageState, emojiPicked]);

	useEffect(() => {
		handleEventAfterEmojiPicked();
	}, [emojiPicked, addEmojiState]);

	useEffect(() => {
		if (getRefMessageReply && getRefMessageReply.attachments) {
			dispatch(
				referencesActions.setDataReferences([
					{
						message_id: '',
						message_ref_id: getRefMessageReply.id,
						ref_type: 0,
						message_sender_id: getRefMessageReply.sender_id,
						content: JSON.stringify(getRefMessageReply.content),
						has_attachment: getRefMessageReply.attachments?.length > 0,
					},
				]),
			);
		}
	}, [getRefMessageReply]);

	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	useEffect(() => {
		if ((currentChannelId || currentDmGroupId) && valueTextInput) {
			const convertedHashtag = convertToPlainTextHashtag(valueTextInput);
			setContent(convertedHashtag);
			focusToElement(editorRef);
		}
	}, [currentChannelId, currentDmGroupId, valueTextInput]);

	useEffect(() => {
		if (isFocused) {
			editorRef.current?.focus();
			dispatch(messagesActions.setIsFocused(false));
		}
	}, [dispatch, isFocused]);

	const [mentionWidth, setMentionWidth] = useState('');
	const [chatBoxMaxWidth, setChatBoxMaxWidth] = useState('');

	useEffect(() => {
		if (props.mode === ChannelStreamMode.STREAM_MODE_DM) {
			setMentionWidth(isShowDMUserProfile ? widthDmUserProfile : widthThumbnailAttachment);
			setChatBoxMaxWidth(isShowDMUserProfile ? maxWidthWithDmUserProfile : defaultMaxWidth);
		} else if (props.mode === ChannelStreamMode.STREAM_MODE_GROUP) {
			setMentionWidth(isShowMemberListDM ? widthDmGroupMemberList : widthThumbnailAttachment);
			setChatBoxMaxWidth(isShowMemberListDM ? maxWidthWithDmGroupMemberList : defaultMaxWidth);
		} else {
			setMentionWidth(
				isShowMemberList
					? widthMessageViewChat
					: isShowCreateThread
						? widthMessageViewChatThread
						: isSearchMessage
							? widthSearchMessage
							: widthThumbnailAttachment,
			);
			setChatBoxMaxWidth(
				isShowMemberList
					? maxWidthWithMemberList
					: isShowCreateThread
						? maxWidthWithChatThread
						: isSearchMessage
							? maxWidthWithSearchMessage
							: defaultMaxWidth,
			);
		}
	}, [currentChannel, isSearchMessage, isShowCreateThread, isShowDMUserProfile, isShowMemberList, isShowMemberListDM, props.mode]);

	return (
		<div className="relative">
			{props.isThread && !threadCurrentChannel && (
				<div
					className={`flex flex-col overflow-y-auto h-heightMessageViewChatThread ${appearanceTheme === 'light' ? 'customScrollLightMode' : ''}`}
				>
					<div className="flex flex-col justify-end flex-grow">
						{!threadCurrentChannel && (
							<div className="relative flex items-center justify-center mx-4 w-16 h-16 dark:bg-bgInputDark bg-bgLightModeButton rounded-full pointer-events-none">
								<Icons.ThreadIcon defaultSize="w-7 h-7" />
								{isPrivate === 1 && (
									<div className="absolute right-4 bottom-4">
										<Icons.Locked />
									</div>
								)}
							</div>
						)}
						<ThreadNameTextField
							onChange={handleChangeNameThread}
							onKeyDown={onKeyDown}
							value={nameValueThread ?? ''}
							label="Thread Name"
							placeholder={openThreadMessageState && valueThread?.content.t !== '' ? valueThread?.content.t : 'Enter Thread Name'}
							className="h-10 p-[10px] dark:bg-bgTertiary bg-white dark:text-white text-colorTextLightMode text-base outline-none rounded-md placeholder:text-sm"
						/>
						{!openThreadMessageState && <PrivateThread title="Private Thread" label="Only people you invite and moderators can see" />}
						{valueThread && openThreadMessageState && <ChannelMessageThread message={valueThread} />}
					</div>
				</div>
			)}
			{props.isThread && messageThreadError && !threadCurrentChannel && (
				<span className="text-xs text-[#B91C1C] mt-1 ml-1">{messageThreadError}</span>
			)}
			<MentionsInput
				onPaste={props.handlePaste}
				id="editorReactMention"
				inputRef={editorRef}
				placeholder="Write your thoughs here..."
				value={valueTextInput ?? ''}
				onChange={onChangeMentionInput}
				style={{
					...(appearanceTheme === 'light' ? lightMentionsInputStyle : darkMentionsInputStyle),
					suggestions: {
						...(appearanceTheme === 'light' ? lightMentionsInputStyle.suggestions : darkMentionsInputStyle.suggestions),
						width: `${!closeMenu ? mentionWidth : '90vw'}`,
						left: `${!closeMenu ? '-40px' : '-30px'}`,
					},
					control: {
						...(appearanceTheme === 'light' ? lightMentionsInputStyle.control : darkMentionsInputStyle.control),
						maxWidth: `${!closeMenu ? chatBoxMaxWidth : '75vw'}`,
					},
					maxWidth: `${!closeMenu ? chatBoxMaxWidth : '75vw'}`,
				}}
				className={`dark:bg-channelTextarea bg-channelTextareaLight dark:text-white text-colorTextLightMode rounded-md ${appearanceTheme === 'light' ? 'lightMode lightModeScrollBarMention' : 'darkMode'}`}
				allowSpaceInQuery={true}
				onKeyDown={onKeyDown}
				forceSuggestionsAboveCursor={true}
				customSuggestionsContainer={(children: React.ReactNode) => {
					return <CustomModalMentions children={children} titleModalMention={titleModalMention} />;
				}}
			>
				<Mention
					appendSpaceOnAdd={true}
					data={handleSearchUserMention}
					trigger="@"
					displayTransform={(id: any, display: any) => {
						return `@${display}`;
					}}
					renderSuggestion={(suggestion: MentionDataProps) => {
						return (
							<SuggestItem
								valueHightLight={valueHighlight}
								name={suggestion.display === 'here' ? '@here' : suggestion.displayName ?? ''}
								avatarUrl={suggestion.avatarUrl ?? ''}
								subText={
									suggestion.display === 'here'
										? 'Notify everyone who has permission to see this channel'
										: suggestion.display ?? ''
								}
								subTextStyle={(suggestion.display === 'here' ? 'normal-case' : 'lowercase') + ' text-xs'}
								showAvatar={suggestion.display !== 'here'}
							/>
						);
					}}
					style={mentionStyle}
					className="dark:bg-[#3B416B] bg-bgLightModeButton"
				/>
				<Mention
					markup="#[__display__](__id__)"
					appendSpaceOnAdd={true}
					data={handleSearchHashtag}
					trigger="#"
					displayTransform={(id: any, display: any) => {
						return `#${display}`;
					}}
					style={mentionStyle}
					renderSuggestion={(suggestion) => (
						<SuggestItem
							valueHightLight={valueHighlight}
							name={suggestion.display ?? ''}
							symbol="#"
							subText={(suggestion as ChannelsMentionProps).subText}
							channelId={suggestion.id}
						/>
					)}
					className="dark:bg-[#3B416B] bg-bgLightModeButton"
				/>
				<Mention
					trigger=":"
					markup="__id__"
					regex={neverMatchingRegex}
					data={queryEmojis}
					renderSuggestion={(suggestion) => <SuggestItem name={suggestion.display ?? ''} symbol={(suggestion as EmojiData).emoji} />}
					className="dark:bg-[#3B416B] bg-bgLightModeButton"
					appendSpaceOnAdd={true}
				/>
			</MentionsInput>
		</div>
	);
}

export default MentionReactInput;
