import { ELoadMoreDirection } from '@mezon/chat-scroll';
import { isEqual } from '@mezon/mobile-components';
import { Colors, size, useTheme } from '@mezon/mobile-ui';
import { MessagesEntity } from '@mezon/store-mobile';
import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { style } from './styles';

interface IChannelListMessageProps {
	flatListRef: React.RefObject<FlatList<MessagesEntity>>;
	messages: MessagesEntity[];
	handleScroll: (event) => void;
	renderItem: ({ item }: { item: MessagesEntity }) => React.ReactElement;
	onLoadMore: (direction: ELoadMoreDirection) => void;
	isLoadMoreTop: boolean;
	isLoadMoreBottom: boolean;
}

const ChannelListMessage = React.memo(
	({ flatListRef, messages, handleScroll, renderItem, onLoadMore, isLoadMoreTop, isLoadMoreBottom }: IChannelListMessageProps) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);

		const keyExtractor = useCallback((message) => `${message?.id}_${message?.channel_id}_item_msg`, []);

		const ViewLoadMore = () => {
			return (
				<View style={styles.loadMoreChannelMessage}>
					<Flow size={size.s_30} color={Colors.tertiary} />
				</View>
			);
		};

		const isCannotLoadMore = useMemo(() => {
			const lastMessage = messages?.[messages?.length - 1];

			return lastMessage?.sender_id === '0' && !lastMessage?.content?.t && lastMessage?.username === 'system';
		}, [messages]);

		const handleEndReached = () => {
			if (messages?.length && !isCannotLoadMore) {
				onLoadMore(ELoadMoreDirection.top);
			}
		};

		return (
			<FlatList
				ref={flatListRef}
				inverted
				// overrideProps={{ isInvertedVirtualizedList: true }}
				// showsVerticalScrollIndicator={false}
				data={messages || []}
				onScroll={handleScroll}
				keyboardShouldPersistTaps={'handled'}
				contentContainerStyle={styles.listChannels}
				renderItem={renderItem}
				removeClippedSubviews={false}
				decelerationRate={'fast'}
				keyExtractor={keyExtractor}
				initialNumToRender={15}
				maxToRenderPerBatch={25}
				windowSize={50}
				onEndReached={handleEndReached}
				onEndReachedThreshold={0.1}
				scrollEventThrottle={16}
				// estimatedItemSize={220}
				// viewabilityConfig={{
				// 	minimumViewTime: 0,
				// 	viewAreaCoveragePercentThreshold: 0,
				// 	itemVisiblePercentThreshold: 0,
				// 	waitForInteraction: false
				// }}
				// contentInsetAdjustmentBehavior="automatic"
				ListHeaderComponent={isLoadMoreBottom && !isCannotLoadMore ? <ViewLoadMore /> : null}
				ListFooterComponent={isLoadMoreTop && !isCannotLoadMore ? <ViewLoadMore /> : null}
				onScrollToIndexFailed={(info) => {
					const wait = new Promise((resolve) => setTimeout(resolve, 300));
					wait.then(() => {
						flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
					});
				}}
			/>
		);
	},
	(prev, curr) => {
		return prev.isLoadMoreTop === curr.isLoadMoreTop && isEqual(prev.messages, curr.messages) && prev.isLoadMoreBottom === curr.isLoadMoreBottom;
	}
);
export default ChannelListMessage;
