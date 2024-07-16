import { CircleIcon } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { ClansEntity } from '@mezon/store-mobile';
import { MezonBadge } from 'apps/mobile/src/app/temp-ui';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { style } from './styles';

interface ClanMenuInfoProps {
	clan: ClansEntity;
}
export default function ClanMenuInfo({ clan }: ClanMenuInfoProps) {
	const { t } = useTranslation(['clanMenu']);
	const styles = style(useTheme().themeValue);

	// TODO: check this
	const [onlineMembers, offlineMembers] = [333, 398];

	return (
		<View style={styles.info}>
			<MezonBadge title="Community Clan" />
			<View style={styles.inlineInfo}>
				<CircleIcon height={10} width={10} color="green" />
				<Text style={styles.inlineText}>{`${onlineMembers} ${t('info.online')}`}</Text>
			</View>

			<View style={styles.inlineInfo}>
				<CircleIcon height={10} width={10} color="gray" />
				<Text style={styles.inlineText}>{`${offlineMembers + onlineMembers} ${t('info.members')}`}</Text>
			</View>
		</View>
	);
}
