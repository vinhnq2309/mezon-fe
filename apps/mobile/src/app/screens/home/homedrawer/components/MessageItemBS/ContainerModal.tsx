import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth, useChatReaction, useUserPermission } from '@mezon/core';
import { ActionEmitEvent, CopyIcon, Icons } from '@mezon/mobile-components';
import { Colors, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { messagesActions, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import {
	MessagesEntity,
	appActions,
	selectCurrentChannelId,
	selectDmGroupCurrentId,
	selectMessageEntitiesByChannelId,
	selectPinMessageByChannelId,
	setIsForwardAll,
	useAppSelector
} from '@mezon/store-mobile';
import { getSrcEmoji } from '@mezon/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useImage } from 'apps/mobile/src/app/hooks/useImage';
import { ChannelStreamMode } from 'mezon-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, DeviceEventEmitter, Platform, Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { getMessageActions } from '../../constants';
import { EMessageActionType, EMessageBSToShow } from '../../enums';
import { IMessageAction, IMessageActionNeedToResolve, IReplyBottomSheet } from '../../types/message.interface';
import EmojiSelector from '../EmojiPicker/EmojiSelector';
import UserProfile from '../UserProfile';
import { emojiFakeData } from '../fakeData';
import { style } from './styles';

const NX_CHAT_APP_ANNONYMOUS_USER_ID = process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID || 'anonymous';
export const ContainerModal = React.memo((props: IReplyBottomSheet) => {
	const { themeValue } = useTheme();
	const { userProfile } = useAuth();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const { type, onClose, onConfirmAction, message, mode, isOnlyEmojiPicker = false, user, senderDisplayName = '', isPublic = false } = props;
	const checkAnonymous = useMemo(() => message?.sender_id === NX_CHAT_APP_ANNONYMOUS_USER_ID, [message?.sender_id]);
	const timeoutRef = useRef(null);
	const [content, setContent] = useState<React.ReactNode>(<View />);
	const { t } = useTranslation(['message']);
	const { reactionMessageDispatch } = useChatReaction();
	const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);

	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentDmId = useSelector(selectDmGroupCurrentId);

	const { isCanDeleteMessage, isCanManageThread } = useUserPermission();
	const { downloadImage, saveImageToCameraRoll } = useImage();
	const allMessagesEntities = useAppSelector((state) =>
		selectMessageEntitiesByChannelId(state, (currentDmId ? currentDmId : currentChannelId) || '')
	);
	const convertedAllMessagesEntities: MessagesEntity[] = allMessagesEntities ? Object.values(allMessagesEntities) : [];
	const messagePosition = useMemo(() => {
		return convertedAllMessagesEntities?.findIndex((value: MessagesEntity) => value.id === message?.id);
	}, [convertedAllMessagesEntities, message?.id]);

	const isShowForwardAll = () => {
		if (messagePosition === -1) return false;
		return (
			message.isStartedMessageGroup &&
			messagePosition < convertedAllMessagesEntities.length - 1 &&
			!convertedAllMessagesEntities[messagePosition + 1].isStartedMessageGroup
		);
	};

	const handleActionEditMessage = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.EditMessage,
			targetMessage: message
		};
		//Note: trigger to ChatBox.tsx
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
		dispatch(
			messagesActions.setChannelDraftMessage({
				channelId: message.channel_id,
				channelDraftMessage: {
					message_id: message?.id,
					draftContent: message?.content,
					draftMention: message?.mentions ?? [],
					draftAttachment: message?.attachments ?? []
				}
			})
		);
	};
	const listPinMessages = useSelector(selectPinMessageByChannelId(message?.channel_id));
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const isDM = useMemo(() => {
		return [ChannelStreamMode.STREAM_MODE_DM, ChannelStreamMode.STREAM_MODE_GROUP].includes(mode);
	}, [mode]);

	const handleActionReply = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.Reply,
			targetMessage: message,
			replyTo: senderDisplayName
		};
		//Note: trigger to ChatBox.tsx
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCreateThread = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.CreateThread,
			targetMessage: message
		};
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCopyText = () => {
		onClose();
		Clipboard.setString(message.content.t);
		Toast.show({
			type: 'success',
			props: {
				text2: t('toast.copyText'),
				leadingIcon: <CopyIcon color={Colors.bgGrayLight} />
			}
		});
	};

	const handleActionDeleteMessage = () => {
		onClose();
		Alert.alert(
			'Delete Message',
			'Are you sure you want to delete this message?',
			[
				{
					text: 'No',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{
					text: 'Yes',
					onPress: () =>
						onConfirmAction({
							type: EMessageActionType.DeleteMessage,
							message
						})
				}
			],
			{ cancelable: false }
		);
	};

	const handleActionPinMessage = () => {
		if (message) onClose();
		timeoutRef.current = setTimeout(() => {
			onConfirmAction({
				type: EMessageActionType.PinMessage
			});
		}, 500);
	};

	const handleActionUnPinMessage = () => {
		if (message) onClose();
		timeoutRef.current = setTimeout(() => {
			onConfirmAction({
				type: EMessageActionType.UnPinMessage
			});
		}, 500);
	};

	const handleActionMarkUnRead = () => {
		Toast.show({ type: 'info', text1: 'Updating...' });
	};

	const handleActionMention = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.Mention,
			targetMessage: message
		};
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCopyMessageLink = () => {
		Toast.show({ type: 'info', text1: 'Updating...' });
	};

	const handleActionCopyMediaLink = () => {
		const media = message?.attachments;
		if (media && media.length > 0) {
			const url = media[0].url;
			Clipboard.setString(url);
		}
	};

	const handleActionSaveImage = async () => {
		const media = message?.attachments;
		bottomSheetRef?.current?.dismiss();
		dispatch(appActions.setLoadingMainMobile(true));
		if (media && media.length > 0) {
			const url = media[0].url;
			const type = media?.[0]?.filetype?.split?.('/');
			const filePath = await downloadImage(url, type[1]);

			if (filePath) {
				await saveImageToCameraRoll('file://' + filePath, type[0]);
			}
		}
		dispatch(appActions.setLoadingMainMobile(false));
	};

	const handleActionReportMessage = () => {
		onClose();
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.Report
				});
			},
			Platform.OS === 'ios' ? 500 : 0
		);
	};

	const handleForwardMessage = () => {
		onClose();
		dispatch(setIsForwardAll(false));
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.ForwardMessage,
					message
				});
			},
			Platform.OS === 'ios' ? 500 : 0
		);
	};

	const handleForwardAllMessages = () => {
		onClose();
		dispatch(setIsForwardAll(true));
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.ForwardMessage,
					message
				});
			},
			Platform.OS === 'ios' ? 500 : 0
		);
	};

	const implementAction = (type: EMessageActionType) => {
		switch (type) {
			case EMessageActionType.EditMessage:
				handleActionEditMessage();
				break;
			case EMessageActionType.Reply:
				handleActionReply();
				break;
			case EMessageActionType.CreateThread:
				handleActionCreateThread();
				break;
			case EMessageActionType.CopyText:
				handleActionCopyText();
				break;
			case EMessageActionType.DeleteMessage:
				handleActionDeleteMessage();
				break;
			case EMessageActionType.PinMessage:
				handleActionPinMessage();
				break;
			case EMessageActionType.UnPinMessage:
				handleActionUnPinMessage();
				break;
			case EMessageActionType.MarkUnRead:
				handleActionMarkUnRead();
				break;
			case EMessageActionType.Mention:
				handleActionMention();
				break;
			case EMessageActionType.CopyMessageLink:
				handleActionCopyMessageLink();
				break;
			case EMessageActionType.CopyMediaLink:
				handleActionCopyMediaLink();
				break;
			case EMessageActionType.SaveImage:
				handleActionSaveImage();
				break;
			case EMessageActionType.Report:
				handleActionReportMessage();
				break;
			case EMessageActionType.ForwardMessage:
				handleForwardMessage();
				break;
			case EMessageActionType.ForwardAllMessages:
				handleForwardAllMessages();
				break;
			default:
				break;
		}
	};

	const getActionMessageIcon = (type: EMessageActionType) => {
		switch (type) {
			case EMessageActionType.EditMessage:
				return <Icons.PencilIcon color={themeValue.text} />;
			case EMessageActionType.Reply:
				return <Icons.ArrowAngleLeftUpIcon color={themeValue.text} />;
			case EMessageActionType.ForwardMessage:
				return <Icons.ArrowAngleRightUpIcon color={themeValue.text} />;
			case EMessageActionType.ForwardAllMessages:
				return <Icons.ArrowAngleRightUpIcon color={themeValue.text} />;
			case EMessageActionType.CreateThread:
				return <Icons.ThreadIcon color={themeValue.text} />;
			case EMessageActionType.CopyText:
				return <Icons.CopyIcon color={themeValue.text} />;
			case EMessageActionType.DeleteMessage:
				return <Icons.TrashIcon color={baseColor.red} height={20} width={20} />;
			case EMessageActionType.PinMessage:
				return <Icons.PinIcon color={themeValue.text} />;
			case EMessageActionType.UnPinMessage:
				return <Icons.PinIcon color={themeValue.text} />;
			case EMessageActionType.MarkUnRead:
				return <Icons.ChatMarkUnreadIcon color={themeValue.text} />;
			case EMessageActionType.Mention:
				return <Icons.AtIcon color={themeValue.text} />;
			case EMessageActionType.SaveImage:
				return <Icons.DownloadIcon color={themeValue.text} />;
			case EMessageActionType.CopyMediaLink:
				return <Icons.LinkIcon color={themeValue.text} />;
			case EMessageActionType.CopyMessageLink:
				return <Icons.LinkIcon color={themeValue.text} />;
			case EMessageActionType.Report:
				return <Icons.FlagIcon color={baseColor.red} height={14} width={14} />;
			default:
				return <View />;
		}
	};

	const messageActionList = useMemo(() => {
		const isMyMessage = userProfile?.user?.id === message?.user?.id;
		const isUnPinMessage = listPinMessages.some((pinMessage) => pinMessage?.message_id === message?.id);
		const isHideCreateThread = isDM || !isCanManageThread;
		const isHideDeleteMessage = !((isCanDeleteMessage && !isDM) || isMyMessage);

		const listOfActionOnlyMyMessage = [EMessageActionType.EditMessage];
		const listOfActionOnlyOtherMessage = [EMessageActionType.Report];

		const listOfActionShouldHide = [
			isUnPinMessage ? EMessageActionType.PinMessage : EMessageActionType.UnPinMessage,
			!isShowForwardAll() && EMessageActionType.ForwardAllMessages,
			isHideCreateThread && EMessageActionType.CreateThread,
			isHideDeleteMessage && EMessageActionType.DeleteMessage
		];

		let availableMessageActions: IMessageAction[] = [];
		if (isMyMessage) {
			availableMessageActions = getMessageActions(t).filter(
				(action) => ![...listOfActionOnlyOtherMessage, ...listOfActionShouldHide].includes(action.type)
			);
		} else {
			availableMessageActions = getMessageActions(t).filter(
				(action) => ![...listOfActionOnlyMyMessage, ...listOfActionShouldHide].includes(action.type)
			);
		}
		const mediaList =
			message?.attachments?.length > 0 &&
			message.attachments?.every((att) => att?.filetype?.includes('image') || att?.filetype?.includes('video'))
				? []
				: [EMessageActionType.SaveImage, EMessageActionType.CopyMediaLink];

		const frequentActionList = [EMessageActionType.EditMessage, EMessageActionType.Reply, EMessageActionType.CreateThread];
		const warningActionList = [EMessageActionType.Report, EMessageActionType.DeleteMessage];

		return {
			frequent: availableMessageActions.filter((action) => frequentActionList.includes(action.type)),
			normal: availableMessageActions.filter((action) => ![...frequentActionList, ...warningActionList, ...mediaList].includes(action.type)),
			warning: availableMessageActions.filter((action) => warningActionList.includes(action.type))
		};
	}, [t, userProfile, message, listPinMessages]);

	const renderUserInformation = () => {
		return <UserProfile userId={user?.id} user={user} message={message} checkAnonymous={checkAnonymous} showAction={!isDM} />;
	};

	const handleReact = async (mode, messageId, emoji_id: string, emoji: string, senderId) => {
		await reactionMessageDispatch(
			'',
			mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
			mode !== ChannelStreamMode.STREAM_MODE_CHANNEL ? '' : (message?.clan_id ?? currentClanId),
			message.channel_id ?? '',
			messageId ?? '',
			emoji_id,
			emoji?.trim(),
			1,
			senderId ?? '',
			false,
			true
		);
		onClose();
	};

	const renderMessageItemActions = () => {
		return (
			<View style={styles.messageActionsWrapper}>
				<View style={styles.reactWrapper}>
					{emojiFakeData.map((item, index) => {
						return (
							<Pressable
								key={index}
								style={styles.favouriteIconItem}
								onPress={() =>
									handleReact(
										mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
										message.id,
										item.id,
										item.shortname,
										userProfile?.user?.id
									)
								}
							>
								<FastImage
									source={{
										uri: getSrcEmoji(item.id)
									}}
									resizeMode={'contain'}
									style={{
										width: size.s_28,
										height: size.s_28
									}}
								/>
							</Pressable>
						);
					})}

					<Pressable onPress={() => setIsShowEmojiPicker(true)} style={{ height: size.s_28, width: size.s_28 }}>
						<Icons.ReactionIcon color={themeValue.text} />
					</Pressable>
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.frequent.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.icon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.actionText}>{action.title}</Text>
							</Pressable>
						);
					})}
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.normal.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.icon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.actionText}>{action.title}</Text>
							</Pressable>
						);
					})}
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.warning.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.warningIcon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.warningActionText}>{action.title}</Text>
							</Pressable>
						);
					})}
				</View>
			</View>
		);
	};

	const onSelectEmoji = async (emoji_id: string, emoij: string) => {
		await handleReact(mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL, message.id, emoji_id, emoij, userProfile?.user?.id);
	};

	const renderEmojiSelector = () => {
		return (
			<View style={{ padding: size.s_10 }}>
				<EmojiSelector onSelected={onSelectEmoji} isReactMessage />
			</View>
		);
	};

	const setVisibleBottomSheet = (isShow: boolean) => {
		if (bottomSheetRef) {
			if (isShow) {
				bottomSheetRef.current?.present();
			} else {
				bottomSheetRef.current?.close();
			}
		}
	};

	useEffect(() => {
		return () => {
			timeoutRef.current && clearTimeout(timeoutRef.current);
		};
	}, []);

	useEffect(() => {
		switch (type) {
			case EMessageBSToShow.MessageAction:
				setVisibleBottomSheet(true);
				if (isShowEmojiPicker || isOnlyEmojiPicker) {
					setContent(renderEmojiSelector());
				} else {
					setContent(renderMessageItemActions());
				}
				break;
			case EMessageBSToShow.UserInformation:
				setVisibleBottomSheet(true);
				setContent(renderUserInformation());
				break;
			default:
				setVisibleBottomSheet(false);
				setContent(<View />);
		}
	}, [type, isShowEmojiPicker, isOnlyEmojiPicker]);

	return (
		<View
			style={[
				styles.bottomSheetWrapper,
				{ backgroundColor: isShowEmojiPicker || isOnlyEmojiPicker ? themeValue.secondary : themeValue.primary }
			]}
		>
			{content}
		</View>
	);
});
