import { Attributes, Colors, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			padding: Metrics.size.xl,
			backgroundColor: colors.primary
		},
		inputWrapper: {
			marginBottom: Metrics.size.l
		},
		saveChangeButton: {
			paddingRight: size.s_12,
			fontSize: size.regular
		},
		changed: {
			color: Colors.textViolet
		},
		notChange: {
			color: Colors.titleSteelGray
		}
	});
