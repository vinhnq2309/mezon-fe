import BottomSheet from "@gorhom/bottom-sheet";
import { useChannelMembers, useEmojiSuggestion, useReference, useThreads } from "@mezon/core";
import { ActionEmitEvent, convertMentionsToText, getAttachmentUnique, load, save, STORAGE_KEY_TEMPORARY_INPUT_MESSAGES } from "@mezon/mobile-components";
import { Block, Colors, size } from "@mezon/mobile-ui";
import { selectCurrentChannel } from "@mezon/store-mobile";
import { handleUploadFileMobile, useMezon } from "@mezon/transport";
import { ChannelMembersEntity, MentionDataProps, MIN_THRESHOLD_CHARS, typeConverts, UserMentionsOpt } from "@mezon/utils";
import { useNavigation } from "@react-navigation/native";
import { ChannelStreamMode } from "mezon-js";
import { ApiMessageAttachment, ApiMessageMention } from "mezon-js/api.gen";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, Keyboard, Platform, TextInput, View } from "react-native";
import { TriggersConfig, useMentions } from "react-native-controlled-mentions";
import RNFS from 'react-native-fs';
import { useSelector } from "react-redux";
import { EmojiSuggestion, HashtagSuggestions, Suggestions } from "../../../../../../components/Suggestions";
import { APP_SCREEN } from "../../../../../../navigation/ScreenTypes";
import { EMessageActionType } from "../../../enums";
import { IMessageActionNeedToResolve } from "../../../types";
import AttachmentPicker from "../../AttachmentPicker";
import { IFile } from "../../AttachmentPicker/Gallery";
import AttachmentPreview from "../../AttachmentPreview";
import BottomKeyboardPicker, { IModeKeyboardPicker } from "../../BottomKeyboardPicker";
import EmojiPicker from "../../EmojiPicker";
import { ChatMessageInput } from "../ChatMessageInput";
import { ChatMessageLeftArea } from "../ChatMessageLeftArea";

export const triggersConfig: TriggersConfig<'mention' | 'hashtag' | 'emoji'> = {
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
  emoji: {
    trigger: ':',
    allowedSpacesCount: 0,
    isInsertSpaceAfterMention: true,
  },
};

interface IChatInputProps {
  mode: ChannelStreamMode;
  channelId: string;
  hiddenIcon?: {
    threadIcon?: boolean;
  };
  messageActionNeedToResolve: IMessageActionNeedToResolve | null;
  messageAction?: EMessageActionType;
  onDeleteMessageActionNeedToResolve?: () => void;
  clanId?: string;
}

export const ChatBoxBottomBar = memo(({
  mode = 2,
  channelId = '',
  hiddenIcon,
  messageActionNeedToResolve,
  messageAction,
  onDeleteMessageActionNeedToResolve,
  clanId = ''
}: IChatInputProps) => {
  const [text, setText] = useState<string>('');
  const [mentionTextValue, setMentionTextValue] = useState('');
  const [isShowAttachControl, setIsShowAttachControl] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [modeKeyBoardBottomSheet, setModeKeyBoardBottomSheet] = useState<IModeKeyboardPicker>('text');
  const { attachmentDataRef, setAttachmentData } = useReference();
  const currentChannel = useSelector(selectCurrentChannel);
  const navigation = useNavigation<any>();
  const inputRef = useRef<TextInput>();
  const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
  const { members } = useChannelMembers({ channelId });
  const [heightKeyboardShow, setHeightKeyboardShow] = useState<number>(10);
  const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<IModeKeyboardPicker>('text');
  const bottomPickerRef = useRef<BottomSheet>(null);
  const cursorPositionRef = useRef(0);
  const currentTextInput = useRef('');
  const { emojiPicked, setEmojiSuggestion } = useEmojiSuggestion();
  const [keyboardHeight, setKeyboardHeight] = useState<number>(Platform.OS === 'ios' ? 345 : 274);
  const [isShowEmojiNativeIOS, setIsShowEmojiNativeIOS] = useState<boolean>(false);
  const { setOpenThreadMessageState } = useReference();
  const { setValueThread } = useThreads();
  const { sessionRef, clientRef } = useMezon();
  const { textInputProps, triggers } = useMentions({
    value: mentionTextValue,
    onChange: (newValue) => handleTextInputChange(newValue),
    onSelectionChange: (position) => {
      handleSelectionChange(position);
    },
    triggersConfig,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAllCachedMessage = async () => {
    const allCachedMessage = await load(STORAGE_KEY_TEMPORARY_INPUT_MESSAGES);
    return allCachedMessage;
  };

  const saveMessageToCache = async (text: string) => {
    const allCachedMessage = await getAllCachedMessage();
    save(STORAGE_KEY_TEMPORARY_INPUT_MESSAGES, {
      ...allCachedMessage,
      [channelId]: text,
    });
  };

  const setMessageFromCache = async () => {
    const allCachedMessage = await getAllCachedMessage();
    setText(convertMentionsToText(allCachedMessage?.[channelId] || ''));
  };

  const resetCachedText = useCallback(async () => {
    const allCachedMessage = await getAllCachedMessage();
    delete allCachedMessage[channelId];
    save(STORAGE_KEY_TEMPORARY_INPUT_MESSAGES, {
      ...allCachedMessage,
    });
  }, [channelId]);

  const onShowKeyboardBottomSheet = useCallback((isShow: boolean, height: number, type?: IModeKeyboardPicker) => {
    setHeightKeyboardShow(height);
    if (isShow) {
      setTypeKeyboardBottomSheet(type);
      bottomPickerRef.current?.collapse();
    } else {
      setTypeKeyboardBottomSheet('text');
      bottomPickerRef.current?.close();
    }
  }, []);

  useEffect(() => {
    if (channelId) {
      setMessageFromCache();
    }
  }, [channelId]);

  useEffect(() => {
    if (emojiPicked) {
      handleEventAfterEmojiPicked();
    }
  }, [emojiPicked]);

  const handleEventAfterEmojiPicked = () => {
    setText(`${text?.endsWith(' ') ? text : text + ' '}${emojiPicked?.toString()} `);
  };

  const removeAttachmentByUrl = (urlToRemove: string, fileName: string) => {
    const removedAttachment = attachmentDataRef.filter((attachment) => {
      if (attachment.url === urlToRemove) {
        return false;
      }
      return !(fileName && attachment.filename === fileName);
    });

    setAttachmentData(removedAttachment);
  }

  const onSendSuccess = useCallback(() => {
    setText('');
    resetCachedText();
  }, [resetCachedText])

  const handleKeyboardBottomSheetMode = useCallback((mode: IModeKeyboardPicker) => {
    setModeKeyBoardBottomSheet(mode);
    if (mode === 'emoji' || mode === 'attachment') {
      onShowKeyboardBottomSheet(true, keyboardHeight, mode);
    } else {
      inputRef && inputRef.current && inputRef.current.focus();
      onShowKeyboardBottomSheet(false, 0);
    }
  }, [keyboardHeight, onShowKeyboardBottomSheet])

  const handleTextInputChange = async (text: string) => {
    const isConvertToFileTxt = text?.length > MIN_THRESHOLD_CHARS;
    if (isConvertToFileTxt) {
      setText('');
      currentTextInput.current = '';
      await onConvertToFiles(text);
    } else {
      setText(convertMentionsToText(text));
      setMentionTextValue(text);
    }
    setIsShowAttachControl(false);
    saveMessageToCache(text);
  };

  const handleSelectionChange = (selection: { start: number; end: number }) => {
    cursorPositionRef.current = selection.start;
  };

  function keyboardWillShow(event) {
    if (keyboardHeight !== event.endCoordinates.height) {
      setIsShowEmojiNativeIOS(event.endCoordinates.height >= 380 && Platform.OS === 'ios');
      setKeyboardHeight(event.endCoordinates.height <= 345 ? 345 : event.endCoordinates.height);
    }
  }

  const handleMessageAction = (messageAction: IMessageActionNeedToResolve) => {
    const { type, targetMessage } = messageAction;
    switch (type) {
      case EMessageActionType.Reply:
        setText('');
        break;
      case EMessageActionType.EditMessage:
        setText(targetMessage.content.t);
        break;
      case EMessageActionType.CreateThread:
        setOpenThreadMessageState(true);
        setValueThread(targetMessage);
        timeoutRef.current = setTimeout(() => {
          navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL });
        }, 500);
        break;
      default:
        break;
    }
  };

  const getListMentionSelected = (mentionData: MentionDataProps[]) => {
    if (!mentionTextValue || !mentionData?.length) return;
    const mentionRegex = /(?<!\w)@[\w.]+(?!\w)/g;
    const validMentions = text?.match(mentionRegex);
    const mentionsSelected = mentionData?.filter((mention) => {
      return validMentions?.includes(`@${mention.display}` || '');
    });
    return mentionsSelected.map((mention) => ({
      id: mention.id,
      display: `@${mention.display}`,
    }));
  };

  const handleMentionInput = (mentions: MentionDataProps[]) => {
    const mentionedUsers: UserMentionsOpt[] = [];
    const mentionList =
      members?.map((item: ChannelMembersEntity) => ({
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

  const onSelectMention = (mentionData: MentionDataProps[]) => {
    const mentionsSelected = getListMentionSelected(mentionData);
    handleMentionInput(mentionsSelected);
  }

  const handleInsertMentionTextInput = async (mentionMessage) => {
    const cursorPosition = cursorPositionRef?.current;
    const inputValue = currentTextInput?.current;
    if (!mentionMessage?.display) return;
    const textMentions = `@${mentionMessage?.display} `;
    const textArray = inputValue?.split?.('');
    textArray.splice(cursorPosition, 0, textMentions);
    const textConverted = textArray.join('');
    setText(textConverted);
    setMentionTextValue(textConverted);
  };

  const onAddMentionMessageAction = async (mentionData: MentionDataProps[]) => {
    const mention = mentionData?.find((mention) => {
      return mention.id === messageActionNeedToResolve?.targetMessage?.sender_id;
    });
    await handleInsertMentionTextInput(mention);
    onDeleteMessageActionNeedToResolve();
    openKeyBoard();
  }

  const onConvertToFiles = useCallback(async (content: string) => {
    try {
      if (content?.length > MIN_THRESHOLD_CHARS) {
        const fileTxtSaved = await writeTextToFile(content);
        const session = sessionRef.current;
        const client = clientRef.current;

        if (!client || !session || !currentChannel.channel_id) {
          console.log('Client is not initialized');
        }
        handleUploadFileMobile(client, session, fileTxtSaved.name, fileTxtSaved)
          .then((attachment) => {
            handleFinishUpload(attachment);
            return 'handled';
          })
          .catch((err) => {
            console.log('err', err);
            return 'not-handled';
          });
      }
    } catch (e) {
      console.log('err', e);
    }
  }, []);

  const handleFinishUpload = useCallback((attachment: ApiMessageAttachment) => {
    typeConverts.map((typeConvert) => {
      if (typeConvert.type === attachment.filetype) {
        return (attachment.filetype = typeConvert.typeConvert);
      }
    });
    setAttachmentData(attachment);
  }, []);

  const writeTextToFile = async (text: string) => {
    // Define the path to the file
    const now = Date.now();
    const filename = now + '.txt';
    const path = RNFS.DocumentDirectoryPath + `/${filename}`;

    // Write the text to the file
    await RNFS.writeFile(path, text, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Read the file to get its base64 representation
    const fileData = await RNFS.readFile(path, 'base64');

    // Create the file object
    const fileFormat: IFile = {
      uri: path,
      name: filename,
      type: 'text/plain',
      size: (await RNFS.stat(path)).size.toString(),
      fileData: fileData,
    };

    return fileFormat;
  };

  const resetInput = () => {
    setIsFocus(false);
    inputRef.current?.blur();
    if (timeoutRef) {
      clearTimeout(timeoutRef.current);
    }
  };

  const openKeyBoard = () => {
    timeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
      setIsFocus(true);
    }, 300);
  };

  useEffect(() => {
    if (messageActionNeedToResolve !== null) {
      const { isStillShowKeyboard } = messageActionNeedToResolve;
      if (!isStillShowKeyboard) {
        resetInput();
      }
      handleMessageAction(messageActionNeedToResolve)
      openKeyBoard();
    }
    return () => {
      resetInput();
    }
  }, [messageActionNeedToResolve])

  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidShow', keyboardWillShow);
    return () => {
      keyboardListener.remove();
    };
  }, []);

  return (
    <Block paddingHorizontal={size.s_6} style={[isShowEmojiNativeIOS && { paddingBottom: size.s_50 }]}>
      <Suggestions
        channelId={channelId}
        {...triggers.mention}
        messageActionNeedToResolve={messageActionNeedToResolve}
        onAddMentionMessageAction={onAddMentionMessageAction}
        mentionTextValue={mentionTextValue}
        onSelectMention={onSelectMention}
      />
      <HashtagSuggestions {...triggers.hashtag} />
      <EmojiSuggestion {...triggers.emoji} />

      {!!attachmentDataRef?.length && (
        <AttachmentPreview attachments={getAttachmentUnique(attachmentDataRef)} onRemove={removeAttachmentByUrl} />
      )}

      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap={size.s_10}
        paddingVertical={size.s_10}
      >
        <ChatMessageLeftArea
          isShowAttachControl={isShowAttachControl}
          setIsShowAttachControl={setIsShowAttachControl}
          text={text}
          hiddenIcon={hiddenIcon}
          modeKeyBoardBottomSheet={modeKeyBoardBottomSheet}
          handleKeyboardBottomSheetMode={handleKeyboardBottomSheetMode}
        />

        <ChatMessageInput
          channelId={channelId}
          mode={mode}
          isFocus={isFocus}
          isShowAttachControl={isShowAttachControl}
          text={text}
          textInputProps={textInputProps}
          ref={inputRef}
          messageAction={messageAction}
          mentionData={mentionData}
          messageActionNeedToResolve={messageActionNeedToResolve}
          modeKeyBoardBottomSheet={modeKeyBoardBottomSheet}
          onSendSuccess={onSendSuccess}
          handleKeyboardBottomSheetMode={handleKeyboardBottomSheetMode}
          setIsShowAttachControl={setIsShowAttachControl}
          onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
          setModeKeyBoardBottomSheet={setModeKeyBoardBottomSheet}
          keyboardHeight={keyboardHeight}
        />
      </Block>

      <View
        style={{
          height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 10,
          backgroundColor: 'transparent',
        }}
      />

      {heightKeyboardShow !== 0 && typeKeyboardBottomSheet !== 'text' && (
        <BottomKeyboardPicker height={heightKeyboardShow} ref={bottomPickerRef} isStickyHeader={typeKeyboardBottomSheet === 'emoji'}>
          {typeKeyboardBottomSheet === 'emoji' ? (
            <EmojiPicker
              directMessageId={clanId === "0" ? channelId : ''}
              onDone={() => {
                onShowKeyboardBottomSheet(false, heightKeyboardShow, 'text');
                DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, {});
              }}
              bottomSheetRef={bottomPickerRef}
            />
          ) : typeKeyboardBottomSheet === 'attachment' ? (
            <AttachmentPicker currentChannelId={channelId} currentClanId={clanId} />
          ) : (
            <View />
          )}
        </BottomKeyboardPicker>
      )}
    </Block>
  )
})