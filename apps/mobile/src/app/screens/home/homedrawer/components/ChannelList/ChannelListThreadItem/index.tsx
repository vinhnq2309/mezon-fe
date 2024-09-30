import { size, useTheme } from '@mezon/mobile-ui';
import { selectIsUnreadChannelById, selectLastChannelTimestamp, useAppSelector } from '@mezon/store';
import { selectNotificationMentionCountByChannelId } from '@mezon/store-mobile';
import { ChannelThreads } from '@mezon/utils';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import LongCornerIcon from '../../../../../../../assets/svg/long-corner.svg';
import ShortCornerIcon from '../../../../../../../assets/svg/short-corner.svg';
import { style } from './styles';

interface IChannelListThreadItemProps {
	onPress?: (thread: any) => void;
	onLongPress?: (thread: ChannelThreads) => void;
	thread: any;
	isActive?: boolean;
	isFirstThread?: boolean;
}

function useChannelBadgeCount(channelId: string) {
	const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
	const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));

	return numberNotification;
}

export default function ChannelListThreadItem({ onPress, onLongPress, thread, isActive, isFirstThread }: IChannelListThreadItemProps) {
	const { themeValue, theme } = useTheme();
	const styles = style(themeValue);

	const isUnReadChannel = useAppSelector((state) => selectIsUnreadChannelById(state, thread.id));

	const numberNotification = useChannelBadgeCount(thread.id);

	const onPressThreadItem = () => {
		onPress && onPress(thread);
	};

	const onLongPressThreadItem = () => {
		onLongPress && onLongPress(thread);
	};

	return (
		<View key={thread.id} style={[styles.channelListLink]}>
			<View style={[styles.threadItem]}>
				{isFirstThread ? <ShortCornerIcon width={size.s_12} height={size.s_16} /> : <LongCornerIcon width={size.s_12} height={size.s_36} />}
				<TouchableOpacity
					style={[
						styles.boxThread,
						isActive && { backgroundColor: theme === 'light' ? themeValue.secondaryWeight : themeValue.secondaryLight }
					]}
					activeOpacity={1}
					onPress={onPressThreadItem}
					onLongPress={onLongPressThreadItem}
				>
					<Text style={[styles.titleThread, isUnReadChannel && styles.channelListItemTitleActive]}>{thread?.channel_label}</Text>
				</TouchableOpacity>
			</View>

			{numberNotification > 0 && (
				<View style={[styles.channelDotWrapper, isFirstThread && { top: size.s_4 }]}>
					<Text style={styles.channelDot}>{numberNotification}</Text>
				</View>
			)}
		</View>
	);
}
