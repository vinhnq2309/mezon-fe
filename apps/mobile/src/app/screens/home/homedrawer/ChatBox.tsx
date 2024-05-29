import {
	ActionEmitEvent,
	AngleRightIcon,
	GiftIcon,
	MicrophoneIcon,
	SendIcon,
	convertMentionsToData,
	convertMentionsToText,
	getAttachmentUnique
} from '@mezon/mobile-components';
import { useChannelMembers, useChannels, useChatSending, useDirectMessages, useReference, useThreads } from '@mezon/core';
import { Colors, size, useAnimatedState } from '@mezon/mobile-ui';
import { ChannelMembersEntity, IMessageSendPayload, IMessageWithUser, MentionDataProps, UserMentionsOpt } from '@mezon/utils';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
	DeviceEventEmitter,
	Dimensions,
	Keyboard,
	TextInput,
	View,
	Text,
	Pressable,
	Platform,
	TouchableOpacity,
	KeyboardEvent
} from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import { IModeKeyboardPicker } from './components';
import AttachmentSwitcher from './components/AttachmentPicker/AttachmentSwitcher';
import EmojiSwitcher from './components/EmojiPicker/EmojiSwitcher';
import { EMessageActionType } from './enums';
import { styles } from './styles';
import { useSelector } from 'react-redux';
import { selectCurrentChannel, selectMemberByUserId } from '@mezon/store';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { ApiMessageMention, ApiMessageAttachment, ApiMessageRef } from 'mezon-js/api.gen';
import AttachmentPreview from './components/AttachmentPreview';
import UseMentionList from '../../../hooks/useUserMentionList';
import { renderTextContent } from './components/RenderTextContent';
import { ChannelsMention, HashtagSuggestions, Suggestions } from '../../../components/Suggestions';
import { TriggersConfig, useMentions } from 'react-native-controlled-mentions';
import { IMessageActionNeedToResolve, IPayloadThreadSendMessage } from './types';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { ChannelStreamMode } from 'mezon-js';
import { RootState } from '@mezon/store-mobile';

export const triggersConfig: TriggersConfig<'mention' | 'hashtag'> = {
	mention: {
		trigger: '@',
		allowedSpacesCount: 0,
		isInsertSpaceAfterMention: true,
	},
	hashtag: {
		trigger: '#',
		allowedSpacesCount: 0,
		isInsertSpaceAfterMention: true,
		textStyle: {
			fontWeight: 'bold',
			color: Colors.white,
		},
	},
};
const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;
interface IChatBoxProps {
	channelLabel: string;
	channelId: string;
	mode: ChannelStreamMode;
	messageAction?: EMessageActionType,
	onShowKeyboardBottomSheet: (isShow: boolean, height: number, type?: string) => void;
}
const ChatBox = memo((props: IChatBoxProps) => {
	const inputRef = useRef<TextInput>();
	const [modeKeyBoardBottomSheet, setModeKeyBoardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [mentionTextValue, setMentionTextValue] = useState('');
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const { members } = useChannelMembers({ channelId: props.channelId });
	const currentChannel = useSelector(selectCurrentChannel);
	const listMentions = UseMentionList(currentChannel?.id);
	const { listChannels } = useChannels();
	const { textInputProps, triggers } = useMentions({
		value: mentionTextValue,
		onChange: (newValue) => handleTextInputChange(newValue),
		onSelectionChange: (position) => { handleSelectionChange(position) },
		triggersConfig,
	});
	const [listChannelsMention, setListChannelsMention] = useState<ChannelsMention[]>([])
	const { sendMessage, sendMessageTyping, EditSendMessage } = useChatSending({ channelId: props.channelId, channelLabel: props.channelLabel, mode: props.mode });
	const [messageActionListNeedToResolve, setMessageActionListNeedToResolve] = useState<IMessageActionNeedToResolve[]>([]);
	const [text, setText] = useState<string>('');
	const [isShowAttachControl, setIsShowAttachControl] = useAnimatedState<boolean>(false);
	const [currentSelectedReplyMessage, setCurrentSelectedReplyMessage] = useState<IMessageWithUser | null>(null);
	const [currentSelectedEditMessage, setCurrentSelectedEditMessage] = useState<IMessageWithUser | null>(null);
	const [isFocus, setIsFocus] = useState<boolean>(Platform.OS === 'ios');
	const [senderId, setSenderId] = useState<string>('');
	const senderMessage = useSelector(selectMemberByUserId(senderId));
	const [keyboardHeight, setKeyboardHeight] = useState<number>(Platform.OS === 'ios' ? 345 : 274);
	const navigation = useNavigation();
	const { setValueThread } = useThreads();
	const { setOpenThreadMessageState } = useReference();
	const { attachmentDataRef, setAttachmentData } = useReference();
	const { t } = useTranslation(['message']);
	const cursorPositionRef = useRef(0);
	const currentTextInput = useRef('');
	const mentions = useRef([]);

	//start: DM stuff
	const { sendDirectMessage, sendMessageTyping: directMessageTyping, messages } = useDirectMessages({
        channelId: props.channelId ?? '',
        mode: props.mode
    });
	const sessionUser = useSelector((state: RootState) => state.auth.session);
	const handleSendDM = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
		) => {
			if (sessionUser) {
				sendDirectMessage(content, mentions, attachments, references);
			} else {
				console.error('Session is not available');
			}
		},
		[sendDirectMessage, sessionUser],
	);

	const handleDirectMessageTyping = useCallback(() => {
		directMessageTyping();
	}, [directMessageTyping]);

	const handleDirectMessageTypingDebounced = useThrottledCallback(handleDirectMessageTyping, 1000);
	//end: DM stuff

	useEffect(() => {
		mentions.current = listMentions || [];
	}, [listMentions])

	const editMessage = useCallback(
		(editMessage: string, messageId: string) => {
			EditSendMessage(editMessage, messageId);
		},
		[EditSendMessage],
	);

	const removeMessageActionByType = useCallback((type: EMessageActionType) => {
		const newStack = [...messageActionListNeedToResolve.filter(it => it.type !== type)];
		setMessageActionListNeedToResolve(newStack);
	}, [messageActionListNeedToResolve])

	const removeAction = useCallback((actionType: EMessageActionType) => {
		switch (actionType) {
			case EMessageActionType.Reply:
				setSenderId('');
				removeMessageActionByType(EMessageActionType.Reply);
				setCurrentSelectedReplyMessage(null);
				break;
			case EMessageActionType.EditMessage:
				setCurrentSelectedEditMessage(null);
				removeMessageActionByType(EMessageActionType.EditMessage);
				setText('');
				break;
			default:
				break;
		}
	}, [removeMessageActionByType])

	const handleSendMessage = useCallback(() => {
		const payloadThreadSendMessage: IPayloadThreadSendMessage = {
			content: { t: text },
			mentions: mentionData,
			attachments: [],
			references: [],
		}
		const attachmentDataUnique = getAttachmentUnique(attachmentDataRef);
		// @ts-ignore
		const checkAttachmentLoading = attachmentDataUnique.some((attachment) => !attachment?.size);
		if (checkAttachmentLoading && !!attachmentDataUnique?.length) {
			Toast.show({
				type: 'error',
				text1: t('toast.attachmentIsLoading'),
			});
			return;
		}
		const isEditMessage = messageActionListNeedToResolve[messageActionListNeedToResolve.length - 1]?.type === EMessageActionType.EditMessage;
		if (isEditMessage) {
			editMessage(text, currentSelectedEditMessage.id);
			//TODO: edit for dm
			removeAction(EMessageActionType.EditMessage);
		} else {
			const reference = currentSelectedReplyMessage ? [{
				message_id: '',
				message_ref_id: currentSelectedReplyMessage.id,
				ref_type: 0,
				message_sender_id: currentSelectedReplyMessage.user.id,
				content: JSON.stringify(currentSelectedReplyMessage.content),
				has_attachment: Boolean(currentSelectedReplyMessage.attachments.length),
			}] : undefined;

			if (![EMessageActionType.CreateThread].includes(props.messageAction)) {
				switch (props.mode) {
					case ChannelStreamMode.STREAM_MODE_CHANNEL:
						sendMessage({ t: text }, mentionData, attachmentDataUnique || [], reference, false);
						break;
					case ChannelStreamMode.STREAM_MODE_DM:
					case ChannelStreamMode.STREAM_MODE_GROUP:
						handleSendDM({ t: text }, mentionData, attachmentDataUnique || [], reference);
						break;
					default:
						break;
				}
				setAttachmentData([]);
				removeAction(EMessageActionType.Reply);
			}
		}
		inputRef?.current?.clear?.();
		setText('');
		[EMessageActionType.CreateThread].includes(props.messageAction) && DeviceEventEmitter.emit(ActionEmitEvent.SEND_MESSAGE, payloadThreadSendMessage);
	}, [sendMessage, handleSendDM, props.mode, text, mentionData, currentSelectedReplyMessage, messageActionListNeedToResolve, currentSelectedEditMessage, editMessage, removeAction, attachmentDataRef, inputRef]);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	useEffect(() => {
		messageActionListNeedToResolve.forEach((item) => {
			const { targetMessage, type } = item;
			switch (type) {
				case EMessageActionType.Reply:
					setCurrentSelectedReplyMessage(targetMessage);
					setSenderId(targetMessage.sender_id);
					break;
				case EMessageActionType.EditMessage:
					setCurrentSelectedEditMessage(targetMessage);
					setText(targetMessage.content.t);
					break;
				default:
					setSenderId('');
					break;
			}
		})
	}, [messageActionListNeedToResolve])

	const sortMessageActionList = (a: IMessageActionNeedToResolve, b: IMessageActionNeedToResolve) => {
		if (a.type === EMessageActionType.EditMessage && b.type !== EMessageActionType.EditMessage) {
			return 1;
		}
		if (a.type !== EMessageActionType.EditMessage && b.type === EMessageActionType.EditMessage) {
			return -1;
		}
		return 0;
	}

	const pushMessageActionIntoStack = useCallback((messagePayload: IMessageActionNeedToResolve) => {
		const isExistingAction = messageActionListNeedToResolve.some(it => it.type === messagePayload.type);
		if (isExistingAction) {
			const newStack = [...messageActionListNeedToResolve.filter(it => it.type !== messagePayload.type), { ...messagePayload }].sort(sortMessageActionList);
			setMessageActionListNeedToResolve(newStack);
		} else {
			setMessageActionListNeedToResolve(preValue => [...preValue, { ...messagePayload }].sort(sortMessageActionList))
		}
	}, [messageActionListNeedToResolve])

	function keyboardWillShow(event: KeyboardEvent) {
		if (keyboardHeight !== event.endCoordinates.height) {
			setKeyboardHeight(event.endCoordinates.height);
		}
	}
	useEffect(() => {
		const keyboardListener = Keyboard.addListener('keyboardDidShow', keyboardWillShow);
		const showKeyboard = DeviceEventEmitter.addListener(
			ActionEmitEvent.SHOW_KEYBOARD,
			(value) => {
				//NOTE: trigger from message action 'MessageItemBS component'
				resetInput();
				handleMessageAction(value)
				openKeyBoard();
			},
		);
		return () => {
			showKeyboard.remove();
			resetInput();
			keyboardListener.remove();
		};
	}, []);

	useEffect(() => {
		const listChannelsMention: ChannelsMention[] = listChannels.map((item) => {
			return {
				id: item?.channel_id ?? '',
				display: item?.channel_label ?? '',
				subText: item?.category_name ?? '',
			};
		});
		setListChannelsMention(listChannelsMention)
	}, [listChannels])


	const handleTextInputChange = (text) => {
		setText(convertMentionsToText(text));
		setMentionTextValue(text);
		setIsShowAttachControl(false);
		switch (props.mode) {
			case ChannelStreamMode.STREAM_MODE_CHANNEL:
				handleTypingDebounced();
				break;
			case ChannelStreamMode.STREAM_MODE_DM:
			case ChannelStreamMode.STREAM_MODE_GROUP:
				handleDirectMessageTypingDebounced();
				break;
			default:
				break;
		}	
	}

	const handleMentionInput = (mentions: MentionDataProps[]) => {
		const mentionedUsers: UserMentionsOpt[] = [];
		const mentionList =
			members[0].users?.map((item: ChannelMembersEntity) => ({
				id: item?.user?.id ?? '',
				display: item?.user?.username ?? '',
				avatarUrl: item?.user?.avatar_url ?? '',
			})) ?? [];
		const convertedMentions: UserMentionsOpt[] = mentionList
			? mentionList.map((mention) => ({
				user_id: mention.id.toString() ?? '',
				username: mention.display ?? '',
			}))
			: [];
		if (mentions?.length > 0) {
			if (mentions.some((mention) => mention.display === '@here')) {
				mentionedUsers.splice(0, mentionedUsers.length);
				convertedMentions.forEach((item) => {
					mentionedUsers.push(item);
				});
			} else {
				for (const mention of mentions) {
					if (mention.display.startsWith('@')) {
						mentionedUsers.push({
							user_id: mention.id.toString() ?? '',
							username: mention.display ?? '',
						});
					}
				}
			}
			setMentionData(mentionedUsers);
		}
	};

	useEffect(() => {

		const mentionsSelected = getListMentionSelected();
		handleMentionInput(mentionsSelected);
	}, [mentionTextValue]);

	const getListMentionSelected = () => {
		if (!mentionTextValue || !mentions?.current?.length) return;
		const mentionRegex = /(?<!\w)@[\w.]+(?!\w)/g;
		const validMentions = text?.match(mentionRegex);
		const mentionsSelected = mentions?.current?.filter(mention => {
			return validMentions?.includes(`@${mention.display}` || '')
		});
		return mentionsSelected.map(mention => ({
			id: mention.id,
			display: `@${mention.display}`
		}))
	}

	const handleMessageAction = (messageAction: IMessageActionNeedToResolve) => {
		const { type, targetMessage } = messageAction;
		switch (type) {
			case EMessageActionType.EditMessage:
			case EMessageActionType.Reply:
				pushMessageActionIntoStack(messageAction);
				break;
			case EMessageActionType.CreateThread:
				setOpenThreadMessageState(true);
				setValueThread(targetMessage);
				// @ts-ignore
				navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL });
				break;
			case EMessageActionType.Mention:
				selectMentionMessage(targetMessage)
				break;
			default:
				break;
		}
	}

	const openKeyBoard = () => {
		timeoutRef.current = setTimeout(() => {
			inputRef.current?.focus();
			setIsFocus(true);
		}, 300);
	};

	const handleInsertMentionTextInput = (mentionMessage) => {
		const cursorPosition = cursorPositionRef?.current;
		const inputValue = currentTextInput?.current;
		if (!mentionMessage?.display) return;
		const textMentions = `@${mentionMessage?.display} `;
		const textArray = inputValue.split('');
		textArray.splice(cursorPosition, 0, textMentions)
		const textConverted = textArray.join('')
		setText(textConverted)
		setMentionTextValue(textConverted)
	}

	useEffect(() => {
		currentTextInput.current = text;
	}, [text])

	const selectMentionMessage = (message: IMessageWithUser) => {
		const mention = mentions?.current?.find(mention => {
			return mention.id === message.sender_id
		});
		handleInsertMentionTextInput(mention)
	}

	const handleSelectionChange = (selection: {
		start: number;
		end: number;
	}) => {
		cursorPositionRef.current = selection.start;
	};

	const resetInput = () => {
		setIsFocus(false);
		inputRef.current?.blur();
		if (timeoutRef) {
			clearTimeout(timeoutRef.current);
		}
	};

	function handleKeyboardBottomSheetMode(mode: IModeKeyboardPicker) {
		setModeKeyBoardBottomSheet(mode);
		if (mode === 'emoji' || mode === 'attachment') {
			props.onShowKeyboardBottomSheet(true, keyboardHeight, mode);
		} else {
			inputRef && inputRef.current && inputRef.current.focus();
			props.onShowKeyboardBottomSheet(false, 0);
		}
	}

	function handleInputFocus() {
		setModeKeyBoardBottomSheet('text');
		inputRef && inputRef.current && inputRef.current.focus();
		props.onShowKeyboardBottomSheet(false, keyboardHeight);
	}

	function handleInputBlur() {
		setIsShowAttachControl(false);
		if (modeKeyBoardBottomSheet === 'text') props.onShowKeyboardBottomSheet(false, 0);
	}

	function removeAttachmentByUrl(urlToRemove: string, fileName: string) {
		const removedAttachment = attachmentDataRef.filter((attachment) => {
			if (attachment.url === urlToRemove) {
				return false;
			}
			return !(fileName && attachment.filename === fileName);
		});

		setAttachmentData(removedAttachment);
	}

	return (
		<View style={styles.wrapperChatBox}>
			<View style={styles.aboveTextBoxWrapper}>
				{senderMessage?.user?.username ? (
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.Reply)}>
							<Feather size={25} name="x" style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>
							{t('chatBox.replyingTo')} {senderMessage?.user?.username}
						</Text>
					</View>
				) : null}
				{currentSelectedEditMessage ? (
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.EditMessage)}>
							<Feather size={25} name='x' style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>{t('chatBox.editingMessage')}</Text>
					</View>
				) : null}
			</View>
			<Suggestions suggestions={listMentions} {...triggers.mention} />
			<HashtagSuggestions listChannelsMention={listChannelsMention} {...triggers.hashtag} />
			{
				!!attachmentDataRef?.length && <AttachmentPreview attachments={getAttachmentUnique(attachmentDataRef)} onRemove={removeAttachmentByUrl} />
			}
			<View style={styles.containerInput}>
				{text.length > 0 && !isShowAttachControl ? (
					<TouchableOpacity
						style={[styles.iconContainer, { backgroundColor: '#333333' }]}
						onPress={() => setIsShowAttachControl(!isShowAttachControl)}
					>
						<AngleRightIcon width={18} height={18} />
					</TouchableOpacity>
				) : (
					<>
						<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
							<AttachmentSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
						</View>
						<TouchableOpacity
							style={[styles.iconContainer, { backgroundColor: '#333333', marginRight: isShowAttachControl ? size.s_10 : 0 }]}
							onPress={() => Toast.show({ type: 'info', text1: 'Updating...' })}
						>
							<GiftIcon width={22} height={22} />
						</TouchableOpacity>
					</>
				)}

				<View style={styles.wrapperInput}>
					<TextInput
						ref={inputRef}
						autoFocus={isFocus}
						placeholder={'Write your thoughts here...'}
						placeholderTextColor={Colors.textGray}
						blurOnSubmit={false}
						onSubmitEditing={handleSendMessage}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						{...textInputProps}
						style={[
							styles.inputStyle,
							text.length > 0 && { width: inputWidthWhenHasInput },
							{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
						]}
					>
						{renderTextContent(text)}
					</TextInput>
					<View style={styles.iconEmoji}>
						<EmojiSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
					</View>
				</View>

				<View style={[styles.iconContainer, { backgroundColor: '#2b2d31' }]}>
					{text.length > 0 || !!attachmentDataRef?.length ? (
						<View onTouchEnd={handleSendMessage} style={[styles.iconContainer, styles.iconSend]}>
							<SendIcon width={18} height={18} />
						</View>
					) : (
						<TouchableOpacity onPress={() => Toast.show({ type: 'info', text1: 'Updating...' })}>
							<MicrophoneIcon width={22} height={22} />
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
});

export default ChatBox;
