import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { appActions, referencesActions } from '@mezon/store';
import { createUploadFilePath, handleUploadFileMobile, useMezon } from '@mezon/transport';
import { IFile } from 'apps/mobile/src/app/temp-ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Gallery from './Gallery';
import { style } from './styles';

export type AttachmentPickerProps = {
	mode?: number;
	currentChannelId?: string;
	currentClanId?: string;
	onCancel?: () => void;
};

function AttachmentPicker({ mode, currentChannelId, currentClanId, onCancel }: AttachmentPickerProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['message']);
	const { sessionRef, clientRef } = useMezon();
	const timeRef = useRef<any>();
	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			timeRef?.current && clearTimeout(timeRef.current);
		};
	}, []);

	const getFullFileName = useCallback(
		(fileName: string) => {
			const session = sessionRef.current;
			return createUploadFilePath(session, currentClanId, currentChannelId, fileName);
		},
		[currentChannelId, currentClanId, sessionRef],
	);

	const onPickFiles = async () => {
		try {
			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(true));
			}, 500);
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			});
			const file = res?.[0];
			const attachment = {
				url: file?.uri || file?.fileCopyUri,
				filename: getFullFileName(file?.name || file?.uri),
				filetype: file?.type,
			};
			dispatch(
				referencesActions.setAttachmentData({
					channelId: currentChannelId,
					attachments: [attachment],
				}),
			);
			const fileData = await RNFS.readFile(file?.uri || file?.fileCopyUri, 'base64');

			const fileFormat: IFile = {
				uri: file?.uri || file?.fileCopyUri,
				name: file?.name,
				type: file?.type,
				size: file?.size,
				fileData
			};
			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(false));
			}, 2000);
			handleFiles([fileFormat]);
		} catch (err) {
			timeRef.current = setTimeout(() => {
				dispatch(appActions.setIsFromFCMMobile(false));
			}, 2000);
			if (DocumentPicker.isCancel(err)) {
				onCancel?.();
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
			return handleUploadFileMobile(client, session, currentClanId, currentChannelId, file.name, file);
		});

		Promise.all(promises).then((attachments) => {
			attachments.forEach((attachment) => handleFinishUpload(attachment));
		});
	};

	const handleSelectedAttachments = useCallback((file: IFile) => {
		dispatch(
			referencesActions.setAttachmentData({
				channelId: currentChannelId,
				attachments: [
					{
						filename: file.name,
						filetype: file.type,
						size: 0, // Mark as pending upload item
						url: file.uri
					}
				],
			}),
		);

		dispatch(referencesActions.setPendingAttachment({
			channelId: currentChannelId,
			files: [{
				name: file.name,
				path: file.uri,
				type: file.type,
				size: file.size as number,
			}]
		}));
	}, [])

	const handleFinishUpload = useCallback(
		(attachment: ApiMessageAttachment) => {
			dispatch(
				referencesActions.setAttachmentData({
					channelId: currentChannelId,
					attachments: [attachment],
				}),
			);
		},
		[currentChannelId, dispatch],
	);

	return (
		<View style={styles.container}>
			<View style={styles.wrapperHeader}>
				<TouchableOpacity activeOpacity={0.8} style={styles.buttonHeader} onPress={() => Toast.show({ type: 'info', text1: 'Updating...' })}>
					<Icons.PollsIcon height={20} width={20} color={themeValue.text} />
					<Text style={styles.titleButtonHeader}>{t('message:actions.polls')}</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} onPress={onPickFiles} style={styles.buttonHeader}>
					<Icons.AttachmentIcon height={20} width={20} color={themeValue.text} />
					<Text style={styles.titleButtonHeader}>{t('message:actions.files')}</Text>
				</TouchableOpacity>
			</View>
			<Gallery onPickGallery={handleSelectedAttachments} currentChannelId={currentChannelId} />
		</View>
	);
}

export default AttachmentPicker;
