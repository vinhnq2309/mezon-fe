import { Colors } from '@mezon/mobile-ui';
import { appActions, clansActions, getStoreAsync, selectAllClans, selectCurrentClan } from '@mezon/store-mobile';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector } from 'react-redux';
import PlusGreenIcon from '../../../../assets/svg/guildAddCategoryChannel.svg';
import LogoMezon from '../../../../assets/svg/logoMezon.svg';
import { ClanIcon } from './Reusables';
import ListClanPopupProps from './components/ListClanPopup';
import { styles } from './styles';
import { useEffect } from 'react';

const ServerList = React.memo((props: any) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const clans = useSelector(selectAllClans);
	const currentClan = useSelector(selectCurrentClan);

	const handleChangeClan = async (clanId: string) => {
		const store = await getStoreAsync();
		store.dispatch(appActions.setLoadingMainMobile(true));
		store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
	};

  useEffect(()=>{
    setIsVisible(false)
  },[currentClan])

	return (
		<View style={styles.wrapperServerList}>
			<View style={styles.mb_10}>
				<ClanIcon icon={<LogoMezon width={40} height={40} />} data={[]} />
			</View>
			<View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
				<View style={{ borderWidth: 0.5, borderColor: 'lightgray', width: '50%' }} />
			</View>
			<View style={styles.mb_10}>
				<ClanIcon data={currentClan} onPress={handleChangeClan} />
			</View>

			<Tooltip
				isVisible={isVisible}
				content={
					<ListClanPopupProps
            handleChangeClan={handleChangeClan}
						clans={clans}
					/>
          }
				contentStyle={{ backgroundColor: Colors.secondary}}
				placement="bottom"
				onClose={() => setIsVisible(false)}
			>
				<Pressable
					style={styles.wrapperPlusClan}
					onPress={() => {
						setIsVisible(!isVisible);
					}}
				>
					<PlusGreenIcon width={30} height={30} />
				</Pressable>
			</Tooltip>
		</View>
	);
});

export default ServerList;
