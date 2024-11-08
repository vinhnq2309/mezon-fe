import { abbreviateText, FileIcon } from '@mezon/mobile-components';
import { Colors, verticalScale } from '@mezon/mobile-ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

interface IProps {
	attachment: ApiMessageAttachment;
}

const AttachmentFilePreview = ({ attachment }: IProps) => {
	const splitFiletype = attachment?.filetype?.split?.('/');
	const type = splitFiletype?.[splitFiletype?.length - 1];
	return (
		<View style={styles.fileViewer}>
			<FileIcon width={verticalScale(30)} height={verticalScale(30)} color={Colors.bgViolet} />
			<View style={{ maxWidth: '75%' }}>
				<Text style={styles.fileName} numberOfLines={1}>
					{abbreviateText(attachment.filename)}
				</Text>
				<Text style={styles.typeFile} numberOfLines={1}>
					{type}
				</Text>
			</View>
		</View>
	);
};

export default React.memo(AttachmentFilePreview);
