import { Icons } from "@mezon/mobile-components";
import { Block, size, Text, useTheme } from "@mezon/mobile-ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { EMessageActionType } from "../../../enums";
import { IMessageActionNeedToResolve } from "../../../types";

interface IActionMessageSelectedProps {
  messageActionNeedToResolve: IMessageActionNeedToResolve | null;
  onClose: () => void
}

export const ActionMessageSelected = memo(({ messageActionNeedToResolve, onClose }: IActionMessageSelectedProps) => {
  const { themeValue } = useTheme();
  const { t } = useTranslation(['message']);
  return (
    <Block flexDirection="column" backgroundColor={themeValue.primary}>
      {messageActionNeedToResolve?.replyTo ? (
        <Block
          flexDirection="row"
          alignItems="center"
          padding={size.tiny}
          gap={10}
          borderBottomWidth={1}
          borderBottomColor={themeValue.border}
        >
          <Pressable onPress={() => onClose()}>
            <Icons.CircleXIcon height={20} width={20} color={themeValue.text} />
          </Pressable>
          <Text color={themeValue.text} h6>
            {t('chatBox.replyingTo')} {messageActionNeedToResolve?.replyTo}
          </Text>
        </Block>
      ) : null}
      {messageActionNeedToResolve?.type === EMessageActionType.EditMessage ? (
        <Block
          flexDirection="row"
          alignItems="center"
          padding={size.tiny}
          gap={10}
          borderBottomWidth={1}
          borderBottomColor={themeValue.border}
        >
          <Pressable onPress={() => onClose()}>
            <Icons.CircleXIcon height={20} width={20} color={themeValue.text} />
          </Pressable>
          <Text color={themeValue.text} h6>{t('chatBox.editingMessage')}</Text>
        </Block>
      ) : null}
    </Block>
  )
})