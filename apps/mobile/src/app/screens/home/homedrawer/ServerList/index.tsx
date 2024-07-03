import { Colors, baseColor, useTheme } from '@mezon/mobile-ui';
import { appActions, clansActions, getStoreAsync, selectAllClans, selectCurrentClan } from '@mezon/store-mobile';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View, Text } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector } from 'react-redux';
import LogoMezon from '../../../../../assets/svg/logoMezon.svg';
import ListClanPopupProps from '../components/ListClanPopup';
import { UnreadDMBadgeList } from '../components/UnreadDMBadgeList';
import { APP_SCREEN } from '../../../../navigation/ScreenTypes';
import { SeparatorWithLine } from '../../../../components/Common';
import { useFriends } from '@mezon/core';
import { Icons, PlusGreenIcon } from '@mezon/mobile-components';
import { style } from './styles';
import { ClanIcon } from '../components/ClanIcon';

const ServerList = React.memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const clans = useSelector(selectAllClans);
	const currentClan = useSelector(selectCurrentClan);
	const timeoutRef = useRef<any>();
	const { quantityPendingRequest } = useFriends();

	const handleChangeClan = async (clanId: string) => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, 200);
		const store = await getStoreAsync();
    store.dispatch(clansActions.joinClan({ clanId: clanId }));
		store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
	};

	useEffect(() => {
		return () => {
			timeoutRef?.current && clearTimeout(timeoutRef.current);
		};
	}, []);

	const navigateToDM = () => {
		props.navigation.navigate(APP_SCREEN.MESSAGES.HOME);
	}

	return (
		<View style={styles.wrapperServerList}>
			<TouchableOpacity onPress={() => navigateToDM()}>
				<LogoMezon width={50} height={50} />
				{quantityPendingRequest ? (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{quantityPendingRequest}</Text>
					</View>
				) : null}
			</TouchableOpacity>

			<SeparatorWithLine style={{ width: '60%' }} />

			<UnreadDMBadgeList />

			<ClanIcon data={currentClan} onPress={handleChangeClan} isActive={true} />

			<Tooltip
				isVisible={isVisible}
				closeOnBackgroundInteraction={true}
				disableShadow={true}
				closeOnContentInteraction={true}
				content={<ListClanPopupProps handleChangeClan={handleChangeClan} clans={clans} />}
				contentStyle={{ backgroundColor: themeValue.primary }}
				placement="bottom"
				onClose={() => setIsVisible(false)}
			>
				<Pressable
					style={styles.wrapperPlusClan}
					onPress={() => {
						setIsVisible(!isVisible);
					}}
				>
					<Icons.PlusLargeIcon color={baseColor.green} />
				</Pressable>
			</Tooltip>

			<Pressable style={styles.wrapperPlusClan}>
				<Icons.HubIcon color={baseColor.green} />
			</Pressable>
		</View>
	);
});

export default ServerList;
