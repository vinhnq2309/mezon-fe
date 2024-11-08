import { Attributes } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		channelView: {
			flex: 1,
			backgroundColor: colors.primary
		}
	});