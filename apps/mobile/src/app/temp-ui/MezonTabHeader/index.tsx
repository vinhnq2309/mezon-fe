import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

interface IMezonTabHeaderProps {
	tabIndex: number;
	tabs: string[];
	onChange?: (tabIndex: number) => void;
	isNeedConfirmWhenSwitch?: boolean;
	confirmCallback?: () => Promise<boolean>;
}

export default function MezonTabHeader({ tabIndex, tabs, isNeedConfirmWhenSwitch = false, confirmCallback, onChange }: IMezonTabHeaderProps) {
	const [tab, setTab] = useState<number>(tabIndex);

	useEffect(() => {
		if (tab !== tabIndex) setTab(tabIndex);
	}, [tabIndex]);

	async function handleTabHeaderPress(index: number) {
		if (isNeedConfirmWhenSwitch) {
			const isConfirm = await confirmCallback?.();
			if (!isConfirm) {
				return;
			}
		}

		if (tab !== index) {
			onChange && onChange(index);
		}
	}

	return (
		<View style={styles.switchContainer}>
			{tabs.map((tabItem, index) => (
				<View key={index.toString()} style={styles.switchWrapper}>
					<TouchableOpacity
						style={[styles.switchButton, tab === index && styles.switchButtonActive]}
						onPress={() => handleTabHeaderPress(index)}
					>
						<Text style={styles.switchText}>{tabItem}</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
}
