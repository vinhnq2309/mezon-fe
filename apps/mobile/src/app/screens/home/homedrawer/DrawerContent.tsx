import { useTheme } from '@mezon/mobile-ui';
import { RootState, selectAllClans } from '@mezon/store-mobile';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import ChannelList from './ChannelList';
import ServerList from './ServerList';
import UserEmptyClan from './UserEmptyClan';
import { style } from './styles';

const DrawerContent = React.memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const clansLoadingStatus = useSelector((state: RootState) => state?.clans?.loadingStatus);
	const clans = useSelector(selectAllClans);
	const [isEmptyClan, setIsEmptyClan] = useState<boolean>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsEmptyClan(clansLoadingStatus === 'loaded' && !clans?.length);
		}, 2000);
		
		return () => clearTimeout(timer);
	}, [clansLoadingStatus, clans?.length]);
	return (
		<View style={[styles.containerDrawerContent, { backgroundColor: themeValue.primary }]}>
			<ServerList />
			{isEmptyClan ? <UserEmptyClan /> : <ChannelList />}
		</View>
	);
});

export default DrawerContent;
