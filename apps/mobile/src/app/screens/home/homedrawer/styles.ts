import { Colors, size, verticalScale } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

const inputWidth = Dimensions.get('window').width * 0.6;
export const styles = StyleSheet.create({
	mainList: {
		height: '100%',
		width: '78%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: 'hidden',
	},
	listHeader: {
		width: '100%',
		height: 50,
		borderTopLeftRadius: 10,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopRightRadius: 10,
		marginBottom: 10,
	},
	titleHeaderChannel: {
		color: '#FFF',
		fontWeight: 'bold',
		fontSize: 18,
		textTransform: 'uppercase',
	},
	wrapperChatBox: {
		backgroundColor: Colors.secondary,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	aboveTextBoxWrapper: {
		flexDirection: 'column',
		backgroundColor: Colors.bgCharcoal
	},
	aboveTextBoxText: {
		color: Colors.white,
		fontSize: size.s_12
	},
	aboveTextBoxItem: {
		flexDirection: 'row',
		paddingHorizontal: size.tiny,
		padding: size.tiny,
		gap: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.bgDarkSlate
	},
	closeIcon: {
		color: Colors.bgDarkSlate,
		backgroundColor: Colors.white,
		borderRadius: 50,
		fontSize: 19
	},
	iconContainer: {
		width: 35,
		height: 35,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputStyle: {
		height: 40,
		width: inputWidth,
		borderBottomWidth: 0,
		borderRadius: 20,
		paddingLeft: 15,
		paddingRight: 40,
		fontSize: verticalScale(15),
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
		backgroundColor: Colors.primary,
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
		backgroundColor: Colors.tertiaryWeight,
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
		width: '100%',
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
		width: '100%',
		alignItems: 'center',
		marginBottom: verticalScale(10),
	},
	clanIcon: {
		height: verticalScale(50),
		width: verticalScale(50),
		borderRadius: verticalScale(15),
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.tertiaryWeight,
	},
	logoClan: {
		height: verticalScale(70),
		width: verticalScale(70),
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
		borderBottomColor: 'lightgray',
		backgroundColor: Colors.secondary,
	},
	lineActiveClan: {
		backgroundColor: Colors.black,
		width: 4,
		height: '80%',
		top: '10%',
		left: 0,
		borderTopRightRadius: 10,
		borderBottomEndRadius: 10,
		position: 'absolute',
	},
	clanIconActive: {
		backgroundColor: Colors.black,
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
		backgroundColor: Colors.primary,
	},
	friendItemWrapper: {
		marginHorizontal: 20,
		paddingVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderPrimary
	},
	friendItemContent: {
		flexDirection: 'row'
	},
	friendItemName: {
		paddingTop: 10,
		paddingLeft: 10,
		lineHeight: 20,
		color: Colors.white
	},
	inviteButton: {
		paddingVertical: 8,
		paddingHorizontal: 12
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
		marginBottom: size.s_20,
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
		paddingLeft: 30
	},
	replyAvatar: {
		width: 25,
		height: 25,
		borderRadius: 50,
	},
	messageWrapper: {
		flexDirection: 'column',
	},
	repliedTextAvatar: {
		fontSize: size.s_16,
		color: Colors.white,
	},
	repliedContentText: {
		color: Colors.white,
		overflow: 'hidden',
		width: '80%',
	},
	repliedMessageWrapper: {
		flexDirection: 'row',
		gap: 8,
		marginRight: 0
	},
	wrapperMessageBoxCombine: {
		marginTop: size.s_2,
	},
	rowMessageBox: {
		marginLeft: 15,
		justifyContent: 'space-between',
		width: '100%'
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
	contentMessageBox: {
		fontSize: size.medium,
		color: Colors.tertiary,
		marginTop: -5
	},
	contentMessageLink: {
		fontSize: size.medium,
		color: Colors.textLink,
	},
	contentMessageMention: {
		fontSize: size.medium,
		fontWeight: '600',
		color: Colors.textLink,
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
});
