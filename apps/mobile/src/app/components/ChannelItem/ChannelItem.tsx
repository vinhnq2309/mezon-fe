import { Icons, LockIcon } from '@mezon/mobile-components';
import { Block, Colors, size, useTheme } from '@mezon/mobile-ui';
import { ChannelUsersEntity, selectChannelById, useAppSelector } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import IconChannel from '../IconChannel';
import style from './ChannelItem.styles';

type ChannelItemProps = {
	channelData?: ChannelUsersEntity;
	onPress: (channelData: ChannelUsersEntity) => void;
};

export const ChannelItem = React.memo(({ channelData, onPress }: ChannelItemProps) => {
	const { t } = useTranslation(['searchMessageChannel']);
	const { themeValue } = useTheme();
	const parentChannel = useAppSelector((state) => selectChannelById(state, channelData?.parrent_id || ''));
	const parentLabel = useMemo(() => (parentChannel?.channel_label ? `(${parentChannel.channel_label})` : ''), [parentChannel]);
	const styles = style(themeValue);
	const handleOnPress = () => {
		onPress && onPress(channelData);
	};
	return (
		<TouchableOpacity onPress={handleOnPress} style={{ marginBottom: size.s_20 }}>
			{[ChannelType.CHANNEL_TYPE_TEXT, ChannelType.CHANNEL_TYPE_THREAD, ChannelType.CHANNEL_TYPE_APP].includes(channelData?.type) ? (
				<Block flexDirection="row" gap={size.s_10} alignItems="center">
					<IconChannel channelPrivate={channelData?.channel_private} type={channelData?.type} />
					<Block>
						<Block flexDirection="row" alignItems="center" gap={size.s_6} marginBottom={size.s_2}>
							<Text style={styles.channelName}>{`${channelData?.channel_label} ${parentLabel}`}</Text>
						</Block>
						{!!channelData?.clan_name && <Text style={styles.categoryChannel}>{channelData?.clan_name}</Text>}
					</Block>
				</Block>
			) : null}
			{[ChannelType.CHANNEL_TYPE_VOICE, ChannelType.CHANNEL_TYPE_STREAMING].includes(channelData?.type) ? (
				<Block flexDirection="row" gap={size.s_10} alignItems="center" justifyContent="space-between">
					<Block flexDirection="row" gap={size.s_10} alignItems="center">
						<IconChannel channelPrivate={channelData?.channel_private} type={channelData?.type} />
						<Block>
							<Block flexDirection="row" alignItems="center" gap={size.s_6} marginBottom={size.s_2}>
								<Text style={styles.channelName}>{channelData?.channel_label}</Text>
								<LockIcon width={10} height={10} color={Colors.textGray} />
							</Block>
							{!!channelData?.clan_name && <Text style={styles.categoryChannel}>{channelData?.clan_name}</Text>}
						</Block>
					</Block>
					<Block style={styles.joinChannelBtn}>
						<Icons.VoiceNormalIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
						<Text style={styles.joinChannelBtnText}>{t('joinChannel')}</Text>
					</Block>
				</Block>
			) : null}
		</TouchableOpacity>
	);
});
