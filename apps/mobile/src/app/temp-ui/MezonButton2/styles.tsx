import { Attributes, baseColor, Colors, Fonts, Metrics } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			padding: Metrics.size.m,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			borderRadius: 10,
			overflow: 'hidden',
			borderWidth: 1,
			backgroundColor: colors.primary,
			gap: 5,
			alignItems: 'center',
			borderColor: colors.border,
		},

		containerSuccess: {
			backgroundColor: Colors.green,
		},

		containerWarning: {
			backgroundColor: Colors.green,
		},

		containerDanger: {
			backgroundColor: Colors.green,
		},

		containerTheme: {
			backgroundColor: colors.secondary
		},

		containerMd: {
			padding: Metrics.size.l,
		},

		containerLg: {
			padding: Metrics.size.l,
		},

		fluid: {
			flexBasis: 10,
			flexGrow: 1,
		},

		border: {
			backgroundColor: 'transparent',
		},

		title: {
			color: baseColor.white,
			fontSize: Fonts.size.h7,
			textAlign: "center",
			width: "100%"
		},
	});
