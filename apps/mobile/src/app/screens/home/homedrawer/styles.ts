import { Colors, Fonts, Metrics, horizontalScale, size, verticalScale } from '@mezon/mobile-ui';
import { Dimensions, Platform, StyleSheet } from 'react-native';
const width = Dimensions.get('window').width;
const inputWidth = width * 0.6;
export const styles = StyleSheet.create({
	mainList: {
		height: '100%',
		width: '78%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: 'hidden',
	},

	wrapperChatBox: {
		backgroundColor: Colors.secondary,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	aboveTextBoxWrapper: {
		flexDirection: 'column',
		backgroundColor: Colors.bgCharcoal,
	},
	aboveTextBoxText: {
		color: Colors.white,
		fontSize: size.s_12,
	},
	aboveTextBoxItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: size.tiny,
		padding: size.tiny,
		gap: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.bgDarkSlate,
	},
	closeIcon: {
		color: Colors.bgDarkSlate,
		backgroundColor: Colors.white,
		borderRadius: 50,
		fontSize: 19,
	},
	iconContainer: {
		width: 35,
		height: 35,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerInput: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: size.s_10,
	},
	wrapperInput: {
		position: 'relative',
		justifyContent: 'center',
		backgroundColor: Colors.tertiaryWeight,
		paddingVertical: size.s_4,
		borderRadius: size.s_22,
	},
	inputStyle: {
		maxHeight: size.s_40 * 2,
		lineHeight: size.s_20,
		width: inputWidth,
		borderBottomWidth: 0,
		borderRadius: size.s_20,
		paddingLeft: Platform.OS === 'ios' ? size.s_16 : size.s_20,
		paddingRight: size.s_40,
		fontSize: size.medium,
		paddingTop: size.s_8,
		backgroundColor: Colors.tertiaryWeight,
		color: Colors.tertiary,
		textAlignVertical: 'center',
	},
	iconEmoji: {
		position: 'absolute',
		right: 10,
	},
	iconSend: {
		backgroundColor: '#5865F2',
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerDrawerContent: {
		flex: 1,
		flexDirection: 'row',
	},
	homeDefault: {
		backgroundColor: '#2b2d31',
		flex: 1,
	},
	wrapperChannelMessage: {
		flex: 1,
		justifyContent: 'space-between',
	},
	listChannels: {
		paddingTop: size.s_14,
		backgroundColor: Colors.tertiaryWeight,
	},
	channelListLink: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: Metrics.size.l
	},
	channelListSection: {
		width: '100%',
		paddingHorizontal: 8,
		marginBottom: 20,
	},
	channelListHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	channelListHeaderItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	channelListHeaderItemTitle: {
		textTransform: 'uppercase',
		fontSize: 15,
		fontWeight: 'bold',
		color: Colors.tertiary,
	},
	channelListItem: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		borderRadius: 5,
	},
	channelListItemActive: {
		backgroundColor: Colors.tertiaryWeight,
		borderRadius: size.s_10,
	},
	channelListItemTitle: {
		fontSize: size.s_14,
		fontWeight: '600',
		marginLeft: size.s_6,
		color: Colors.tertiary,
	},
	channelListItemTitleActive: {
		color: Colors.white,
	},
	channelDotWrapper: {
		backgroundColor: Colors.red,
		height: 20,
		width: 20,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	channelDot: {
		color: Colors.white,
		fontSize: Fonts.size.h8,
	},
	dotIsNew: {
		position: 'absolute',
		left: -10,
		width: size.s_6,
		height: size.s_6,
		borderRadius: size.s_6,
		backgroundColor: Colors.white,
	},
	channelListSearch: {
		width: '100%',
		paddingHorizontal: 8,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
	},
	channelListSearchWrapperInput: {
		backgroundColor: Colors.tertiaryWeight,
		flex: 1,
		borderRadius: size.s_16,
		alignItems: 'center',
		paddingHorizontal: size.s_6,
		gap: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	channelListSearchInput: {
		padding: 0,
		flex: 1,
	},
	wrapperClanIcon: {
		alignItems: 'center',
		position: 'relative'
	},
	clanIcon: {
		height: verticalScale(55),
		width: verticalScale(55),
		borderRadius: verticalScale(50),
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.tertiaryWeight,
		borderWidth: 1,
		borderColor: Colors.borderDim,
	},
	logoClan: {
		height: verticalScale(70),
		width: verticalScale(70),
		resizeMode: 'cover',
	},
	textLogoClanIcon: {
		color: Colors.titleReset,
		fontSize: size.s_24,
		fontWeight: '600',
	},
	homeDefaultHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.gray48,
		backgroundColor: Colors.secondary,
	},
	lineActiveClan: {
		backgroundColor: Colors.azureBlue,
		width: 4,
		height: '80%',
		top: '10%',
		left: -13,
		borderTopRightRadius: 10,
		borderBottomEndRadius: 10,
		position: 'absolute',
	},
	clanIconActive: {
		backgroundColor: Colors.black,
		borderRadius: verticalScale(15),
	},
	containerThreadList: {
		paddingLeft: size.s_24,
		paddingBottom: size.s_14,
	},
	titleThread: {
		fontSize: size.s_14,
		fontWeight: '600',
		marginLeft: size.s_6,
		color: Colors.tertiary,
		top: size.s_6,
	},
	iconBar: {
		paddingLeft: size.s_14,
		paddingRight: size.s_18,
		paddingVertical: size.s_14,
	},
	wrapperServerList: {
		height: '100%',
		paddingTop: size.s_20,
		width: '22%',
		justifyContent: 'flex-start',
		backgroundColor: Colors.secondary,
		alignItems: 'center',
		gap: size.s_10
	},
	friendItemWrapper: {
		marginHorizontal: 20,
		paddingVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: Colors.borderPrimary,
	},
	friendItemWrapperInvited: {
		opacity: 0.6
	},
	friendItemContent: {
		flexDirection: 'row',
	},
	friendItemName: {
		paddingTop: 10,
		paddingLeft: 10,
		lineHeight: 20,
		color: Colors.white,
		maxWidth: 200
	},
	inviteButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	invitedButton: {
		borderRadius: 15
	},
	threadItem: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	threadItemActive: {
		backgroundColor: Colors.tertiaryWeight,
		borderRadius: size.s_10,
		position: 'absolute',
		width: '95%',
		height: '85%',
		right: 0,
		top: size.s_20,
	},
	threadFirstItemActive: {
		height: '160%',
		right: 0,
		top: size.s_2,
	},
	wrapperMessageBox: {
		flexDirection: 'row',
		paddingLeft: size.s_10,
		marginBottom: size.s_2,
		paddingRight: size.s_50,
	},
	aboveMessage: {
		flexDirection: 'row',
		paddingLeft: size.s_10,
		gap: 15,
	},
	iconReply: {
		width: 35,
		height: '100%',
		alignItems: 'center',
		paddingLeft: 30,
	},
	replyAvatar: {
		width: size.s_20,
		height: size.s_20,
		borderRadius: size.s_50,
		backgroundColor: Colors.gray48,
		overflow: 'hidden',
	},
	messageWrapper: {
		flexDirection: 'column',
		marginTop: size.s_10,
	},
	highlightMessageMention: {
		backgroundColor: Colors.bgMessageHighlight,
		borderLeftColor: Colors.borderMessageHighlight,
		borderLeftWidth: 2,
		paddingTop: size.s_2,
	},
	repliedTextAvatar: {
		fontSize: size.s_16,
		color: Colors.white,
	},
	repliedContentText: {
		fontSize: size.small,
		color: Colors.tertiary,
		overflow: 'hidden',
		width: '80%',
	},
	repliedMessageWrapper: {
		flexDirection: 'row',
		gap: 8,
		marginRight: 0,
	},
	wrapperMessageBoxCombine: {
		// marginBottom: size.s_10,
	},
	rowMessageBox: {
		marginLeft: 15,
		justifyContent: 'space-between',
		width: '90%',
	},
	rowMessageBoxCombine: {
		marginLeft: verticalScale(44),
	},
	messageBoxTop: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		marginBottom: size.s_6,
	},
	userNameMessageBox: {
		fontSize: size.medium,
		marginRight: size.s_10,
		fontWeight: '600',
		color: Colors.white,
	},
	dateMessageBox: {
		fontSize: size.small,
		color: Colors.gray72,
	},
	contentMessageCombine: {
		padding: size.s_2,
	},
	contentMessageLink: {
		fontSize: size.medium,
		color: Colors.textLink,
		lineHeight: size.s_20,
	},
	loadMoreChannelMessage: {
		paddingVertical: size.s_20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarMessageBoxDefault: {
		width: '100%',
		height: '100%',
		borderRadius: size.s_50,
		backgroundColor: Colors.titleReset,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textAvatarMessageBoxDefault: {
		fontSize: size.s_22,
		color: Colors.white,
	},
	imageMessageRender: {
		borderRadius: verticalScale(5),
		marginVertical: size.s_6,
		borderWidth: 0.5,
		borderColor: Colors.borderPrimary,
	},
	wrapperTypingLabel: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		paddingHorizontal: size.s_10,
		paddingVertical: size.s_10,
	},
	typingLabel: {
		paddingHorizontal: size.s_14,
		paddingVertical: size.s_6,
		fontSize: size.s_14,
		color: Colors.gray72,
	},
	iconUserClan: {
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex',
		borderRadius: 50,
		backgroundColor: Colors.tertiaryWeight,
		width: size.s_30,
		height: size.s_30,
	},
	wrapperWelcomeMessage: {
		paddingHorizontal: size.s_10,
		marginVertical: size.s_30,
	},
	iconWelcomeMessage: {
		backgroundColor: 'rgb(80,80,80)',
		marginBottom: size.s_10,
		width: 70,
		height: 70,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleWelcomeMessage: {
		fontSize: size.s_22,
		marginBottom: size.s_10,
		color: Colors.white,
		fontWeight: '600',
	},
	subTitleWelcomeMessage: {
		fontSize: size.s_14,
		color: Colors.tertiary,
		marginBottom: size.s_10,
	},
	wrapperAttachmentPreview: {
		backgroundColor: Colors.secondary,
		borderTopColor: Colors.gray72,
		paddingVertical: size.s_10,
	},
	fileViewer: {
		gap: size.s_6,
		marginTop: size.s_6,
		paddingHorizontal: size.s_10,
		width: '80%',
		minHeight: verticalScale(50),
		alignItems: 'center',
		borderRadius: size.s_6,
		flexDirection: 'row',
		backgroundColor: Colors.bgPrimary,
	},
	fileName: {
		fontSize: size.small,
		color: Colors.white,
	},
	typeFile: {
		fontSize: size.small,
		color: Colors.textGray,
		textTransform: 'uppercase',
	},
	logoUser: {
		width: '100%',
		height: '100%',
	},
	wrapperAvatar: {
		width: size.s_40,
		height: size.s_40,
		borderRadius: size.s_40,
		overflow: 'hidden',
	},
	wrapperAvatarCombine: {
		width: size.s_40,
	},
	btnScrollDown: {
		position: 'absolute',
		right: size.s_10,
		bottom: size.s_20,
		backgroundColor: Colors.borderPrimary,
		width: size.s_50,
		height: size.s_50,
		borderRadius: size.s_50,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: Colors.black,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
		zIndex: 1000,
	},
	wrapperFooterImagesModal: {
		flex: 1,
		alignSelf: 'center',
		alignItems: 'center',
		width: width,
		marginBottom: verticalScale(60),
	},
	footerImagesModal: {
		maxWidth: '70%',
	},
	imageFooterModal: {
		width: horizontalScale(40),
		height: verticalScale(50),
		marginHorizontal: horizontalScale(5),
		borderRadius: horizontalScale(5),
		borderWidth: 1,
		borderColor: Colors.tertiaryWeight,
	},
	imageFooterModalActive: {
		width: horizontalScale(80),
		height: verticalScale(50),
		borderWidth: 1,
		borderColor: Colors.bgViolet,
	},
	headerImagesModal: {
		padding: size.s_10,
		position: 'absolute',
		zIndex: 1000,
		top: Platform.OS === 'ios' ? size.s_40 : size.s_20,
		right: size.s_10,
		width: size.s_50,
		height: size.s_50,
		borderRadius: size.s_50,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	wrapperPlusClan: {
		height: size.s_50,
		width: size.s_50,
		borderRadius: 50,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.tertiaryWeight,
	},
	overlay: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(000,000,000,0.8)',
	},
	channelContainer: { flexDirection: 'row', alignItems: 'center' },
	threadHeaderBox: { flexDirection: 'row', alignItems: 'center' },
	threadHeaderLabel: { color: Colors.white, fontFamily: 'bold', marginLeft: size.s_10, fontSize: size.label },
	channelHeaderLabel: { color: Colors.textGray, marginLeft: size.s_10, fontSize: size.medium },
	mb_10: {
		marginBottom: verticalScale(10),
	},
	aboveMessageDeleteReply: {
		flexDirection: 'row',
		paddingLeft: size.s_10,
		gap: 5,
	},
	iconMessageDeleteReply: {
		backgroundColor: Colors.bgCharcoal,
		width: size.s_20,
		height: size.s_20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: size.s_6,
		borderRadius: 50,
		marginLeft: size.s_6
	},
	messageDeleteReplyText: {
		fontSize: size.small,
		color: Colors.tertiary,
		overflow: 'hidden',
		width: '80%',
		fontStyle: 'italic'
	}
});
