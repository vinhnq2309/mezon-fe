import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import MezonClanAvatar from '../MezonClanAvatar';
import { style } from './styles';

interface IMezonAvatarProps {
	avatarUrl: string;
	username: string;
	width?: number;
	height?: number;
	userStatus?: boolean;
	isBorderBoxImage?: boolean;
	stacks?: {
		avatarUrl: string;
		username: string;
	}[],
	onPress?: () => void;
	isShow?: boolean;
}
const MezonAvatar = React.memo((props: IMezonAvatarProps) => {
	const { themeValue } = useTheme();
	const { avatarUrl, username, width = 40, height = 40, userStatus, isBorderBoxImage, stacks, onPress, isShow = true } = props;
	const styles = style(themeValue, height, width);

	if (!isShow) return (
		<View style={{ height, width }}></View>
	)

	if (stacks) {
		return (
			<View style={styles.listImageFriend}>
				{stacks.map((user, idx) => {
					return (
						<View key={idx} style={[
							styles.imageContainer,
							styles.borderBoxImage,
							{ height, width }, { right: idx * 20 }
						]}>
							<MezonClanAvatar
								alt={user.username}
								image={user.avatarUrl}
							/>
						</View>
					);
				})}
			</View>
		);
	}

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={[styles.containerItem, { height, width }]}>
				<View style={[styles.boxImage, { height, width }, isBorderBoxImage && styles.borderBoxImage]}>
					<MezonClanAvatar
						alt={username}
						image={avatarUrl}
					/>
				</View>

				{userStatus && <View style={[styles.statusCircle, userStatus ? styles.online : styles.offline]} />}
			</View>
		</TouchableWithoutFeedback>
	);
});

export default MezonAvatar;
