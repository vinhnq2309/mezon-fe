import { Block, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity, selectChannelById } from '@mezon/store-mobile';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { ChannelStatusIcon } from '../../ChannelStatusIcon';
import { style } from './styles';

export const ChannelFavoriteItem = React.memo(({ channelId, onPress }: { channelId: string; onPress: (channel: ChannelsEntity) => void }) => {
	const channel = useSelector(selectChannelById(channelId));
	const styles = style(useTheme().themeValue);
	return (
		<TouchableOpacity
			onPress={() => {
				onPress(channel);
			}}
		>
			<Block style={styles.channelItem}>
				<ChannelStatusIcon channel={channel} />
				<Text style={styles.channelItemTitle}>{channel?.channel_label}</Text>
			</Block>
		</TouchableOpacity>
	);
});