import { useCategory, useReference } from '@mezon/core';
import {
	CHANNEL_ID_SHARING,
	CloseIcon,
	PenIcon,
	STORAGE_CLAN_ID,
	STORAGE_DATA_CATEGORY_CHANNEL,
	SearchIcon,
	SendIcon,
	cloneDeep,
	debounce,
	load,
	save
} from '@mezon/mobile-components';
import { Colors, size, useAnimatedState } from '@mezon/mobile-ui';
import {
	channelsActions,
	directActions,
	getStoreAsync,
	referencesActions,
	selectCurrentChannelId,
	selectCurrentClan,
	selectDirectsOpenlist,
} from '@mezon/store-mobile';
import { createUploadFilePath, useMezon } from '@mezon/transport';
import { ILinkOnMessage } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { isImage, isVideo } from '../../../utils/helpers';
import AttachmentFilePreview from '../../home/homedrawer/components/AttachmentFilePreview';
import { styles } from './styles';

export const Sharing = ({ data, onClose }) => {
	const listDM = useSelector(selectDirectsOpenlist);
	const { categorizedChannels } = useCategory();
	const currentClan = useSelector(selectCurrentClan);
	const currentChannelId = useSelector(selectCurrentChannelId) || '';
	const mezon = useMezon();
	const dispatch = useDispatch();
	const [dataText, setDataText] = useState<string>('');
	const [dataShareTo, setDataShareTo] = useState<any>([]);
	const [isLoading, setIsLoading] = useAnimatedState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');
	const [channelSelected, setChannelSelected] = useState<any>();
	const inputSearchRef = useRef<any>();
	const session = mezon.sessionRef.current;

	const dataMedia = useMemo(() => {
		return data.filter((data: { contentUri: string; filePath: string }) => !!data?.contentUri || !!data?.filePath);
	}, [data]);

	const { attachmentFilteredByChannelId, removeAttachmentByIndex, checkAttachment } = useReference(CHANNEL_ID_SHARING);

	useEffect(() => {
		if (data) {
			if (data?.length === 1 && data?.[0]?.weblink) {
				setDataText(data?.[0]?.weblink);
			}
		}
	}, [data]);

	useEffect(() => {
		if (searchText) {
			handleSearchShareTo();
		} else {
			setDataShareTo([...flattenedData, ...listDM]);
		}
	}, [searchText]);

	useEffect(() => {
		if (dataMedia?.length) {
			convertFileFormat();
		}
	}, [dataMedia]);

	const getFullFileName = useCallback(
		(fileName: string) => {
			return createUploadFilePath(session, currentClan?.id, currentChannelId, fileName);
		},
		[currentChannelId, currentClan?.id, session],
	);

	function flattenData(categorizedChannels: any) {
		const categoryChannel = categorizedChannels || JSON.parse(load(STORAGE_DATA_CATEGORY_CHANNEL) || '[]');

		return categoryChannel.reduce((result: any, category: any) => {
			const { category_id, category_name } = category;

			category.channels.forEach((channel: any) => {
				if (channel.type !== ChannelType.CHANNEL_TYPE_VOICE) {
					result.push({
						...channel,
						category_id,
						category_name,
					});
					channel.threads.forEach((thread: any) => {
						const { id: thread_id } = thread;

						result.push({
							...thread,
							category_id,
							category_name,
							thread_id,
						});
					});
				}
			});

			return result;
		}, []);
	}

	const flattenedData = useMemo(() => flattenData(cloneDeep(categorizedChannels)), [categorizedChannels]);

	useEffect(() => {
		if (flattenedData || listDM) setDataShareTo([...flattenedData, ...listDM]);
	}, [flattenedData, listDM]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetSearchText = useCallback(
		debounce((text) => setSearchText(text), 300),
		[],
	);

	const generateChannelMatch = (data: any, DMList: any, searchText: string) => {
		return [...DMList, ...data].filter((channel: { channel_label?: string | number }) =>
			channel.channel_label?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase()),
		);
	};

	const handleSearchShareTo = async () => {
		const matchedChannels = generateChannelMatch(flattenedData, listDM, searchText);
		setDataShareTo(matchedChannels || []);
	};

	const onChooseSuggestion = async (channel: any) => {
		// Send to DM message
		if (channel.type === ChannelStreamMode.STREAM_MODE_DM || channel.type === ChannelStreamMode.STREAM_MODE_GROUP) {
			const store = await getStoreAsync();
			store.dispatch(
				directActions.joinDirectMessage({
					directMessageId: channel.id,
					channelName: channel.channel_label,
					type: channel.type,
				}),
			);
		}

		setChannelSelected(channel);
	};

	const sendToDM = async (dataSend: { text: any; links: any[] }) => {
		const store = await getStoreAsync();
		store.dispatch(
			channelsActions.joinChat({
				clanId: channelSelected?.clan_id,
				channelId: channelSelected?.channel_id,
				channelType: channelSelected?.type,
			}),
		);
		save(STORAGE_CLAN_ID, channelSelected?.clan_id);

		await mezon.socketRef.current.writeChatMessage(
			'0',
			channelSelected.id,
			Number(channelSelected?.user_id?.length) === 1 ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP,
			{
				t: dataSend.text,
				lk: dataSend.links || [],
			},
			[],
			attachmentFilteredByChannelId?.files || [],
			[],
		);
	};

	const sendToGroup = async (dataSend: { text: any; links: any[] }) => {
		const store = await getStoreAsync();
		store.dispatch(
			channelsActions.joinChat({
				clanId: channelSelected.clan_id,
				channelId: channelSelected.channel_id,
				channelType: channelSelected.type,
			}),
		);
		save(STORAGE_CLAN_ID, channelSelected?.clan_id);

		await mezon.socketRef.current.writeChatMessage(
			currentClan.id,
			channelSelected.channel_id,
			ChannelStreamMode.STREAM_MODE_CHANNEL,
			{
				t: dataSend.text,
				lk: dataSend.links || [],
			},
			[], //mentions
			attachmentFilteredByChannelId?.files || [], //attachments
			[], //references
			false, //anonymous
			false, //mentionEveryone
		);
		const timestamp = Date.now() / 1000;
		dispatch(channelsActions.setChannelLastSeenTimestamp({ channelId: channelSelected.channel_id, timestamp }));
	};

	const processText = (inputString: string) => {
		const links: ILinkOnMessage[] = [];
		const httpPrefix = 'http';

		let i = 0;
		while (i < inputString.length) {
			if (inputString.startsWith(httpPrefix, i)) {
				// Link processing
				const startIndex = i;
				i += httpPrefix.length;
				while (i < inputString.length && ![' ', '\n', '\r', '\t'].includes(inputString[i])) {
					i++;
				}
				const endIndex = i;
				links.push({
					s: startIndex,
					e: endIndex,
				});
			} else {
				i++;
			}
		}

		return { links };
	};
	const onSend = async () => {
		setIsLoading(true);
		const { links } = processText(dataText);
		const dataSend = {
			text: dataText,
			links,
		};

		dispatch(
			referencesActions.setAtachmentAfterUpload({
				channelId: channelSelected?.channel_id,
				messageId: '',
				files: attachmentFilteredByChannelId?.files
			}),
		);

		dispatch(
			referencesActions.setAtachmentAfterUpload({
				channelId: CHANNEL_ID_SHARING,
				messageId: '',
				files: []
			}),
		);

		// Send to DM message
		if (channelSelected.type === ChannelType.CHANNEL_TYPE_GROUP || channelSelected.type === ChannelType.CHANNEL_TYPE_DM) {
			await sendToDM(dataSend);
		} else {
			await sendToGroup(dataSend);
		}
		setIsLoading(false);
		onClose();
	};

	const convertFileFormat = async () => {
		const fileFormats = await Promise.all(
			dataMedia.map(async (media) => {
				const { filePath } = getFullFileName(media?.fileName || media?.contentUri || media?.filePath);
				console.log(filePath);

				dispatch(
					referencesActions.setAtachmentAfterUpload({
						channelId: CHANNEL_ID_SHARING,
						messageId: '',
						files: [{
							url: media?.contentUri || media?.filePath,
							filename: filePath,
							filetype: media?.mimeType,
							size: 1,
						}],
					}),
				);
			}),
		);

	};

	return (
		<SafeAreaView style={styles.wrapper}>
			<View style={styles.header}>
				<TouchableOpacity onPress={onClose}>
					<CloseIcon width={size.s_28} height={size.s_28} />
				</TouchableOpacity>
				<Text style={styles.titleHeader}>Share</Text>
				{channelSelected ? (
					isLoading ? (
						<Flow size={size.s_28} color={Colors.white} />
					) : (
						<TouchableOpacity onPress={onSend}>
							<SendIcon width={size.s_28} height={size.s_20} color={Colors.white} />
						</TouchableOpacity>
					)
				) : (
					<View style={{ width: size.s_28 }} />
				)}
			</View>
			<ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
				<View style={styles.rowItem}>
					<Text style={styles.title}>Message preview</Text>
					{checkAttachment && (
						<View style={[styles.inputWrapper, { marginBottom: size.s_16 }]}>
							<ScrollView horizontal style={styles.wrapperMedia}>
								{attachmentFilteredByChannelId?.files?.map((media: any, index) => {
									let isFile;

									if (Platform.OS === 'android') {
										isFile = !media?.filetype?.includes?.('video') && !media?.filetype?.includes?.('image');
									} else {
										const checkIsImage = isImage(media?.url?.toLowerCase());
										const checkIsVideo = isVideo(media?.url?.toLowerCase());
										isFile = !checkIsImage && !checkIsVideo;
									}
									const isUploaded = !!media?.size || (!media?.size && media?.filetype?.includes?.('video')) || !!media?.url;

									return (
										<View
											key={`${media?.url}_${index}_media_sharing`}
											style={[styles.wrapperItemMedia, isFile && { height: size.s_60, width: size.s_50 * 3 }]}
										>
											{isFile ? (
												<AttachmentFilePreview attachment={media} />
											) : (
												<FastImage source={{ uri: media?.url }} style={styles.itemMedia} />
											)}
											{isUploaded && (
												<TouchableOpacity
													style={styles.iconRemoveMedia}
													onPress={() => removeAttachmentByIndex(CHANNEL_ID_SHARING, index)}
												>
													<CloseIcon width={size.s_18} height={size.s_18} />
												</TouchableOpacity>
											)}

											{!isUploaded && (
												<View style={styles.videoOverlay}>
													<ActivityIndicator size={'small'} color={'white'} />
												</View>
											)}
										</View>
									);
								})}
							</ScrollView>
						</View>
					)}

					<View style={styles.inputWrapper}>
						<View style={styles.iconLeftInput}>
							<PenIcon width={size.s_18} />
						</View>
						<TextInput
							style={styles.textInput}
							value={dataText}
							onChangeText={(text) => setDataText(text)}
							placeholder={'Add a Comment (Optional)'}
							placeholderTextColor={Colors.tertiary}
						/>
						{!!dataText?.length && (
							<TouchableOpacity activeOpacity={0.8} onPress={() => setDataText('')} style={styles.iconRightInput}>
								<CloseIcon width={size.s_18} />
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={styles.rowItem}>
					<Text style={styles.title}>Share to</Text>
					<View style={styles.inputWrapper}>
						{channelSelected ? (
							<FastImage source={{ uri: channelSelected?.channel_avatar?.[0] || currentClan?.logo }} style={styles.iconLeftInput} />
						) : (
							<View style={styles.iconLeftInput}>
								<SearchIcon width={size.s_18} height={size.s_18} />
							</View>
						)}
						{channelSelected ? (
							<Text style={styles.textChannelSelected}>{channelSelected?.channel_label}</Text>
						) : (
							<TextInput
								ref={inputSearchRef}
								style={styles.textInput}
								onChangeText={debouncedSetSearchText}
								placeholder={'Select a channel or category...'}
								placeholderTextColor={Colors.tertiary}
							/>
						)}
						{channelSelected ? (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									setChannelSelected(undefined);
									inputSearchRef?.current?.focus?.();
								}}
								style={styles.iconRightInput}
							>
								<CloseIcon width={size.s_18} />
							</TouchableOpacity>
						) : (
							!!searchText?.length && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										setSearchText('');
										inputSearchRef?.current?.clear?.();
									}}
									style={styles.iconRightInput}
								>
									<CloseIcon width={size.s_18} />
								</TouchableOpacity>
							)
						)}
					</View>
				</View>

				{!!dataShareTo?.length && (
					<View style={styles.rowItem}>
						<Text style={styles.title}>Suggestions</Text>
						{dataShareTo?.map((channel: any, index: number) => {
							return (
								<TouchableOpacity
									onPress={() => onChooseSuggestion(channel)}
									style={styles.itemSuggestion}
									key={`${channel?.id}_${index}_suggestion`}
								>
									<FastImage source={{ uri: channel?.channel_avatar?.[0] || currentClan?.logo }} style={styles.logoSuggestion} />
									<Text style={styles.titleSuggestion} numberOfLines={1}>
										{channel?.channel_label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};
