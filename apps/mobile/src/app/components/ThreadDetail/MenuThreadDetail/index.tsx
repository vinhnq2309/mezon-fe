import { DirectEntity, selectCurrentChannel } from '@mezon/store-mobile';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './style';

import { useTheme } from '@mezon/mobile-ui';
import { IChannel } from '@mezon/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionRow } from '../ActionRow';
import { ThreadHeader } from '../ThreadHeader';
import SearchMessageChannel from '../SearchMessageChannel';
import { AssetsViewer } from '../AssetViewer';

export const threadDetailContext = createContext<IChannel | DirectEntity>(null);

export enum EOpenThreadDetailFrom {
	SearchChannel = 'search_channel',
}

export default function MenuThreadDetail(props: { route: any }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	//NOTE: from DirectMessageDetail component
	const directMessage = props.route?.params?.directMessage as DirectEntity;
	const currentChannel = useSelector(selectCurrentChannel);
	const [isSearchMessageChannel, setIsSearchMessageChannel] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');

	useEffect(() => {
		setIsSearchMessageChannel(props?.route?.params?.openThreadDetailFrom === EOpenThreadDetailFrom.SearchChannel);
	}, [props?.route?.params?.openThreadDetailFrom]);

  const handleSearchText = (value)=>{
    setSearchText(value);
  }

	const channel = useMemo(() => {
		if (directMessage?.id) {
			return directMessage;
		}
		return currentChannel;
	}, [directMessage, currentChannel]);

	return (
		<threadDetailContext.Provider value={channel}>
			<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: themeValue.secondary }}>
				<View style={styles.container}>
					{isSearchMessageChannel ? (
						<SearchMessageChannel onChangeText={handleSearchText} />
					) : (
						<View>
							<ThreadHeader />
							<ActionRow />
						</View>
					)}
          	<AssetsViewer searchText={searchText} isSearchMessageChannel={isSearchMessageChannel} />
				</View>
			</SafeAreaView>
		</threadDetailContext.Provider>
	);
}
