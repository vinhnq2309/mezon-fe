import { Dimensions, StyleSheet } from 'react-native';
import { Colors, verticalScale } from '../../../themes';
import { size } from '../../../themes/Fonts';

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
		minHeight: 80,
		backgroundColor: '#1e1e1e',
		flexDirection: 'row',
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
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
		backgroundColor: '#2b2d31',
	},
	homeDefault: {
		backgroundColor: '#2b2d31',
		flex: 1,
	},
	listChannels: {
		height: '100%',
		flexDirection: 'column-reverse',
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
		color: Colors.Tertiary,
	},
	channelListItem: {
		width: '100%',
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		borderRadius: 5,
	},
	channelListItemTitle: {
		fontSize: size.s_14,
		fontWeight: '600',
		marginLeft: size.s_6,
		color: Colors.Tertiary,
	},
	channelListItemTitleActive: {
		color: Colors.black,
	},
	dotIsNew: {
		position: 'absolute',
		left: -10,
		width: size.s_6,
		height: size.s_6,
		borderRadius: size.s_6,
		backgroundColor: Colors.black,
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
		backgroundColor: Colors.gray48,
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
		backgroundColor: Colors.Tertiary,
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
		paddingVertical: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: 'lightgray',
		backgroundColor: Colors.titleReset,
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
		color: Colors.Tertiary,
		top: size.s_6,
	},
});
