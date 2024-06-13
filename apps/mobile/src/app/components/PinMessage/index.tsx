import { Metrics, size } from '@mezon/mobile-ui';
import {
	AppDispatch,
	PinMessageEntity,
	pinMessageActions,
	selectChannelsEntities,
	selectCurrentChannelId,
	selectEmojiImage,
	selectPinMessageByChannelId,
} from '@mezon/store-mobile';
import { Platform, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import EmptyPinMessage from './EmptyPinMessage';
import { styles } from './PinMessage';
import PinMessageItem from './PinMessageItem';

const PinMessage = () => {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const listPinMessages = useSelector(selectPinMessageByChannelId(currentChannelId));
	const dispatch = useDispatch<AppDispatch>();
	const channelsEntities = useSelector(selectChannelsEntities);
	const emojiListPNG = useSelector(selectEmojiImage);

	const handleUnpinMessage = (message: PinMessageEntity) => {
		dispatch(pinMessageActions.deleteChannelPinMessage({ channel_id: currentChannelId || '', message_id: message.id }));
	};

	return (
		<ScrollView
			style={{ height: Metrics.screenHeight / (Platform.OS === 'ios' ? 1.4 : 1.3) }}
			contentContainerStyle={{ paddingBottom: size.s_50 }}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.containerPinMessage}>
				{listPinMessages?.length ? (
					listPinMessages.map((pinMessage) => {
						let contentString = pinMessage?.content;
						if (typeof contentString === 'string') {
							try {
								const contentObject = JSON.parse(contentString);
								contentString = contentObject.t;
							} catch (e) {
								console.error('Failed to parse content JSON:', e);
							}
						}

						return (
							<PinMessageItem
								pinMessageItem={pinMessage}
								contentMessage={contentString}
								handleUnpinMessage={handleUnpinMessage}
								channelsEntities={channelsEntities}
								emojiListPNG={emojiListPNG}
							/>
						);
					})
				) : (
					<EmptyPinMessage />
				)}
			</View>
		</ScrollView>
	);
};

export default PinMessage;
