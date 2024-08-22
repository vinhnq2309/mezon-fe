import { useTheme } from '@mezon/mobile-ui';
import { selectLastChannelTimestamp, selectNotificationMentionCountByChannelId } from '@mezon/store-mobile';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

interface IChannelBadgeUnreadProps {
	channelId: string;
}

export const ChannelBadgeUnread = React.memo(({ channelId }: IChannelBadgeUnreadProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
	const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));

	if (numberNotification > 0) {
		return (
			<View style={styles.channelDotWrapper}>
				<Text style={styles.channelDot} numberOfLines={1}>{numberNotification}</Text>
			</View>
		);
	}
	return <View />;
});