import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		loadMoreChannelMessage: {
			paddingVertical: size.s_20,
			alignItems: 'center',
			justifyContent: 'center'
		},
		listChannels: {
			paddingTop: size.s_14,
			paddingBottom: size.s_30,
			backgroundColor: colors.primary
		}
	});
