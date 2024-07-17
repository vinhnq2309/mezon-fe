import { useTheme } from '@mezon/mobile-ui';
import { IFile, MezonImagePicker } from 'apps/mobile/src/app/temp-ui';
import { View } from 'react-native';
import { useMixImageColor } from '../../../../../../../app/hooks/useMixImageColor';
import { style } from './styles';

interface IBannerAvatarProps {
	avatar: string;
	onChange?: (url: IFile) => void;
}

export default function BannerAvatar({ avatar, onChange }: IBannerAvatarProps) {
	const { themeValue } = useTheme();
	const { color } = useMixImageColor(avatar);
	const styles = style(themeValue);

	async function selectImage(file: IFile) {
		onChange && onChange(file);
	}

	return (
		<View>
			<View style={[styles.bannerContainer, { backgroundColor: color }]}>
				<MezonImagePicker
					width={"100%"}
					height={"100%"}
					defaultValue={''}
					defaultColor={color}
					noDefaultText
					style={{ borderWidth: 0, borderRadius: 0 }}
					penPosition={{ right: 10, top: 10 }}
				/>
			</View>

			<View style={styles.avatarContainer}>
				<MezonImagePicker
					width={100}
					height={100}
					defaultValue={avatar || ''}
					rounded
					style={{ borderWidth: 5, borderColor: themeValue.primary }}
					onChange={selectImage}
					penPosition={{ right: 5, top: 5 }}
				/>

				<View style={[styles.onLineStatus]}></View>
			</View>
		</View>
	);
}
