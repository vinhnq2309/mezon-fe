import { useCategory } from '@mezon/core';
import { Colors } from '@mezon/mobile-ui';
import { channelsActions, getStoreAsync, messagesActions, selectCurrentClan } from '@mezon/store-mobile';
import React, { useEffect } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import Dots from '../../../../assets/svg/guildMoreOptions1.svg';
import { useAnimatedState } from '../../../hooks/useAnimatedState';
import { ChannelListContext, ChannelListSection } from './Reusables';
import { styles } from './styles';
import { InviteToChannel } from './components';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';

const ChannelList = React.memo((props: any) => {
	const currentClan = useSelector(selectCurrentClan);
	const { categorizedChannels } = useCategory();

	useEffect(() => {
		if (categorizedChannels?.length) {
			setDefaultChannelLoader();
		}
	}, [categorizedChannels]);

	const [collapseChannelItems, setCollapseChannelItems] = useAnimatedState([]);

	const toggleCollapseChannel = (index: string) => {
		if (collapseChannelItems.includes(index)) {
			setCollapseChannelItems(collapseChannelItems.filter((item) => item !== index)); // Collapse if already Collapse
		} else {
			setCollapseChannelItems([...collapseChannelItems, index]); // Expand if not Collapse
		}
	};

	const setDefaultChannelLoader = async () => {
		const store = await getStoreAsync();
		// Auto choose channels first
		if (categorizedChannels) {
			const firstChannel = categorizedChannels?.[0]?.channels?.[0];

			const channelId = firstChannel?.channel_id;
			const clanId = firstChannel?.clan_id;
			store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
			store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
		}
	};
	return (
		<ChannelListContext.Provider value={{ navigation: props.navigation }}>
			<View style={[styles.mainList, { backgroundColor: Colors.surface }]}>
				<ServerListHeader title={currentClan?.clan_name} />
				<View style={styles.channelListSearch}>
					<View style={styles.channelListSearchWrapperInput}>
						<Feather size={18} name="search" style={{ color: Colors.tertiary }} />
						<TextInput placeholder={'Search'} placeholderTextColor={Colors.tertiary} style={styles.channelListSearchInput} />
					</View>
					<InviteToChannel />
				</View>
				<FlatList
					data={categorizedChannels || []}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item, index }) => (
						<ChannelListSection data={item} index={index} onPressHeader={toggleCollapseChannel} collapseItems={collapseChannelItems} />
					)}
				/>
			</View>
		</ChannelListContext.Provider>
	);
});

const ServerListHeader = React.memo((props: { title: string }) => {
	const navigation = useNavigation();

	function handlePress() {
		// @ts-ignore
		navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_CATEGORY });
	}
	return (
		<TouchableOpacity style={styles.listHeader} onPress={handlePress}>
			<Text style={styles.titleHeaderChannel}>{props.title}</Text>
			<Dots width={30} height={30} />
		</TouchableOpacity>
	);
});

export default ChannelList;
