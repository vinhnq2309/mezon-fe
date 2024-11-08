import React, { forwardRef, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { CONTAINER_FLUID_SPACING, CONTAINER_SPACING, propsToStyle } from '../../themes/Metrics';
import { BlockProps } from './Types';

const styles = StyleSheet.create({
	block: {
		flex: 1
	}
});

const Block = forwardRef((props: BlockProps, ref: React.ForwardedRef<View>) => {
	const {
		left,
		flex,
		top,
		block,
		right,
		width,
		height,
		bottom,
		zIndex,
		margin,
		shadowColor,
		shadowOffset,
		shadowOpacity,
		shadowRadius,
		opacity,
		padding,
		children,
		maxWidth,
		overflow,
		position,
		flexWrap,
		minWidth,
		alignSelf,
		maxHeight,
		minHeight,
		marginTop,
		marginLeft,
		alignItems,
		paddingTop,
		marginRight,
		borderStyle,
		marginHorizontal,
		marginVertical,
		paddingLeft,
		borderColor,
		borderWidth,
		borderRadius,
		paddingRight,
		marginBottom,
		paddingBottom,
		borderTopColor,
		justifyContent,
		borderTopWidth,
		paddingVertical,
		borderLeftWidth,
		borderLeftColor,
		borderRightColor,
		borderRightWidth,
		paddingHorizontal,
		borderBottomColor,
		borderBottomWidth,
		borderTopLeftRadius,
		borderTopRightRadius,
		backgroundColor,
		borderBottomLeftRadius,
		borderBottomRightRadius,
		direction: flexDirection,
		aspectRatio,
		style = {},
		container = false,
		containerFluid = false,
		...rest
	} = props;

	const styleComponent = useMemo<StyleProp<ViewStyle>>(
		() => [
			block === true && styles.block,
			{ padding },
			{ backgroundColor },
			{ borderColor },
			{ borderBottomColor },
			{ borderTopColor },
			{ borderLeftColor },
			{ borderRightColor },
			container
				? {
						paddingLeft: CONTAINER_SPACING,
						paddingRight: CONTAINER_SPACING,
						paddingHorizontal: CONTAINER_SPACING
					}
				: containerFluid
					? {
							paddingLeft: CONTAINER_FLUID_SPACING,
							paddingRight: CONTAINER_FLUID_SPACING,
							paddingHorizontal: CONTAINER_FLUID_SPACING
						}
					: { paddingLeft, paddingRight, paddingHorizontal },

			propsToStyle([
				{ margin },
				{ marginTop },
				{ marginBottom },
				{ marginLeft },
				{ marginRight },
				{ marginHorizontal },
				{ marginVertical },
				{ flexDirection },
				{ paddingBottom },
				{ paddingTop },
				{ paddingVertical },
				{ width },
				{ height },
				{ maxHeight },
				{ maxWidth },
				{ minHeight },
				{ minWidth },
				{ borderWidth },
				{ justifyContent },
				{ alignItems },
				{ alignSelf },
				{ borderRadius },
				{ flex },
				{ position },
				{ flexWrap },
				{ left },
				{ right },
				{ bottom },
				{ top },
				{ zIndex },
				{ overflow },
				{ borderBottomLeftRadius },
				{ borderBottomRightRadius },
				{ borderStyle },
				{ borderTopLeftRadius },
				{ borderTopRightRadius },
				{ opacity },
				{ borderBottomWidth },
				{ borderLeftWidth },
				{ borderRightWidth },
				{ borderTopWidth },
				{ aspectRatio },
				{ shadowColor },
				{ shadowOffset },
				{ shadowOpacity },
				{ shadowRadius }
			]),
			style
		],
		[
			container,
			block,
			margin,
			marginLeft,
			marginRight,
			marginTop,
			marginBottom,
			flexDirection,
			shadowColor,
			shadowOffset,
			shadowOpacity,
			shadowRadius,
			padding,
			paddingRight,
			paddingBottom,
			paddingLeft,
			paddingTop,
			paddingHorizontal,
			paddingVertical,
			width,
			height,
			maxHeight,
			maxWidth,
			minHeight,
			minWidth,
			borderWidth,
			borderColor,
			backgroundColor,
			justifyContent,
			alignItems,
			alignSelf,
			borderRadius,
			flex,
			position,
			flexWrap,
			left,
			right,
			bottom,
			top,
			zIndex,
			overflow,
			borderBottomColor,
			borderBottomLeftRadius,
			borderBottomRightRadius,
			borderLeftColor,
			borderRightColor,
			borderStyle,
			borderTopColor,
			borderTopLeftRadius,
			borderTopRightRadius,
			opacity,
			borderBottomWidth,
			borderLeftWidth,
			borderRightWidth,
			borderTopWidth,
			marginHorizontal,
			marginVertical,
			style
		]
	);

	return (
		// eslint-disable-next-line react/no-children-prop
		<View style={[styleComponent]} {...rest} ref={ref} children={children} />
	);
});

export default Block;
