import { useReference } from '@mezon/core';
import { FilesIcon, PollIcon } from '@mezon/mobile-components';
import { handleUploadFileMobile, useMezon } from '@mezon/transport';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Gallery, { IFile } from './Gallery';
import { styles } from './styles';

export type AttachmentPickerProps = {
	mode?: number;
	currentChannelId?: string;
	currentClanId?: string;
};

function AttachmentPicker({ mode, currentChannelId, currentClanId }: AttachmentPickerProps) {
	const { t } = useTranslation(['message']);
	const [file, setFile] = useState(null);
	const { sessionRef, clientRef } = useMezon();
	const { setAttachmentData } = useReference();

	const onPickFiles = async () => {
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			});
			setFile(res[0]);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker
			} else {
				throw err;
			}
		}
	};

	const handleFiles = (files: IFile | any) => {
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!files || !client || !session || !currentChannelId) {
			throw new Error('Client or files are not initialized');
		}

		const promises = Array.from(files).map((file: IFile | any) => {
			const fullFilename = `${currentClanId}/${currentChannelId}`.replace(/-/g, '_') + '/' + file.name;
			return handleUploadFileMobile(client, session, fullFilename, file);
		});

		Promise.all(promises).then((attachments) => {
			attachments.forEach((attachment) => handleFinishUpload(attachment));
		});
	};

	const handleFinishUpload = useCallback((attachment: ApiMessageAttachment) => {
		setAttachmentData(attachment);
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.wrapperHeader}>
				<TouchableOpacity activeOpacity={0.8} style={styles.buttonHeader}>
					<PollIcon />
					<Text style={styles.titleButtonHeader}>{t('message:actions.polls')}</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} onPress={onPickFiles} style={styles.buttonHeader}>
					<FilesIcon />
					<Text style={styles.titleButtonHeader}>{t('message:actions.files')}</Text>
				</TouchableOpacity>
			</View>
			<Gallery onPickGallery={handleFiles} />
		</View>
	);
}

export default AttachmentPicker;
