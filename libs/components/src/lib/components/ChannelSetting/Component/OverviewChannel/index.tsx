import {
	channelsActions,
	ChannelsEntity,
	checkDuplicateChannelInCategory,
	checkDuplicateThread,
	selectAppChannelById,
	useAppDispatch
} from '@mezon/store';
import { InputField, TextArea } from '@mezon/ui';
import { checkIsThread, IChannel, ValidateSpecialCharacters, ValidateURL } from '@mezon/utils';
import { unwrapResult } from '@reduxjs/toolkit';
import { ApiUpdateChannelDescRequest, ChannelType } from 'mezon-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import ModalAskChangeChannel from '../Modal/modalAskChangeChannel';

export type OverviewChannelProps = {
	channel: IChannel;
};

const OverviewChannel = (props: OverviewChannelProps) => {
	const { channel } = props;
	const channelApp = useSelector(selectAppChannelById(channel?.id) || {});
	const [appUrlInit, setAppUrlInit] = useState(channelApp?.url || '');
	const [appUrl, setAppUrl] = useState(appUrlInit);
	const dispatch = useAppDispatch();
	const [channelLabelInit, setChannelLabelInit] = useState(channel.channel_label || '');
	const [topicInit, setTopicInit] = useState('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [topic, setTopic] = useState(topicInit);
	const [channelLabel, setChannelLabel] = useState(channelLabelInit);
	const [checkValidate, setCheckValidate] = useState('');
	const [checkValidateUrl, setCheckValidateUrl] = useState(!ValidateURL().test(appUrlInit || ''));
	const [countCharacterTopic, setCountCharacterTopic] = useState(1024);
	const isThread = checkIsThread(channel as ChannelsEntity);

	const label = useMemo(() => {
		return isThread ? 'thread' : 'channel';
	}, [isThread]);

	const parentLabel = useMemo(() => {
		return isThread ? 'channel' : 'category';
	}, [isThread]);

	const messages = {
		INVALID_NAME: `Please enter a valid ${label} name (max 64 characters, only words, numbers, _ or -).`,
		DUPLICATE_NAME: `The ${label}  name already exists in the ${parentLabel} . Please enter another name.`,
		INVALID_URL: `Please enter a valid URL (e.g., https://example.com).`
	};

	const handleChangeTextArea = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setTopic(e.target.value);
			setCountCharacterTopic(1024 - e.target.value.length);
		},
		[topic, countCharacterTopic]
	);

	const debouncedSetChannelName = useDebouncedCallback(async (value: string) => {
		if (channelLabelInit && value.trim() === channelLabelInit.trim()) {
			setCheckValidate('');
			return;
		}

		const regex = ValidateSpecialCharacters();
		if (regex.test(value)) {
			const checkDuplicate = async (checkFunction: any, payload: any) => {
				await dispatch(checkFunction(payload))
					.then(unwrapResult)
					.then((result: any) => {
						if (result) {
							setCheckValidate(messages.DUPLICATE_NAME);
							return;
						}
						setCheckValidate('');
					});
			};

			if (isThread) {
				await checkDuplicate(checkDuplicateThread, {
					thread_name: value.trim(),
					channel_id: channel.parrent_id ?? ''
				});
			} else {
				await checkDuplicate(checkDuplicateChannelInCategory, {
					channelName: value.trim(),
					categoryId: channel.category_id ?? ''
				});
			}
			return;
		}

		setCheckValidate(messages.INVALID_NAME);
	}, 300);

	const handleDisplayChannelLabel = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setChannelLabel(value);
			debouncedSetChannelName(value);
		},
		[debouncedSetChannelName]
	);

	const handleDisplayAppUrl = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setAppUrl(value);
			const regex = ValidateURL();
			if (regex.test(value) && value !== '') {
				setCheckValidateUrl(false);
			} else {
				setCheckValidateUrl(true);
			}
		},
		[appUrl, checkValidateUrl]
	);

	const handleReset = useCallback(() => {
		setTopic(topicInit);
		setChannelLabel(channelLabelInit);
		setAppUrl(appUrlInit);
	}, [topicInit, channelLabelInit, appUrlInit]);

	const handleSave = useCallback(async () => {
		const updatedChannelLabel = channelLabel === channelLabelInit ? '' : channelLabel;
		const updatedAppUrl = appUrl === appUrlInit ? '' : appUrl;

		setChannelLabelInit(channelLabel);
		setAppUrlInit(appUrl);
		setTopicInit(topic);

		const updateChannel: ApiUpdateChannelDescRequest = {
			channel_id: channel.channel_id || '',
			channel_label: updatedChannelLabel,
			category_id: channel.category_id,
			app_url: updatedAppUrl
		};
		await dispatch(channelsActions.updateChannel(updateChannel));
	}, [channelLabel, channelLabelInit, appUrl, appUrlInit, topic, channel, dispatch]);

	useEffect(() => {
		const textArea = textAreaRef.current;
		if (textArea) {
			textArea.style.height = 'auto';
			textArea.style.height = textArea.scrollHeight + 'px';
		}
	}, [topic]);

	return (
		<div className="overflow-y-auto flex flex-col flex-1 shrink dark:bg-bgPrimary bg-bgLightModeSecond  w-1/2 pt-[94px] sbm:pb-7 sbm:pr-[10px] sbm:pl-[40px] p-4 overflow-x-hidden min-w-full sbm:min-w-[700px] 2xl:min-w-[900px] max-w-[740px] hide-scrollbar">
			<div className="dark:text-white text-black text-[15px]">
				<h3 className="mb-4 font-bold text-xl">Overview</h3>
				<p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">{label} name</p>
				<InputField
					type="text"
					placeholder={channelLabel}
					value={channelLabel}
					onChange={handleDisplayChannelLabel}
					className="dark:bg-black bg-white pl-3 py-2 w-full border-0 outline-none rounded"
					maxLength={Number(process.env.NX_MAX_LENGTH_NAME_ALLOWED)}
				/>
				{checkValidate && <p className="text-[#e44141] text-xs italic font-thin">{checkValidate}</p>}

				{channel.type === ChannelType.CHANNEL_TYPE_APP && (
					<>
						<hr className="border-t border-solid dark:border-borderDefault my-10" />
						<p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">App URL</p>
						<InputField
							type="text"
							placeholder={appUrl}
							value={appUrl}
							onChange={handleDisplayAppUrl}
							className="dark:bg-black bg-white pl-3 py-2 w-full border-0 outline-none rounded"
						/>
						{checkValidateUrl && <p className="text-[#e44141] text-xs italic font-thin">{messages.INVALID_URL}</p>}
					</>
				)}

				<hr className="border-t border-solid dark:border-borderDefault my-10" />
				<p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">{label} Topic</p>
				<div className="relative">
					<TextArea
						placeholder={`Let everyone know how to use this ${label}!`}
						className="resize-none h-auto min-h-[87px] w-full dark:bg-black bg-bgModifierHoverLight dark:text-white text-black overflow-y-hidden outline-none py-2 pl-3 pr-5"
						value={topic}
						onChange={handleChangeTextArea}
						rows={1}
						refTextArea={textAreaRef}
						maxLength={1024}
					></TextArea>
					<p className="absolute bottom-2 right-2 text-[#AEAEAE]">{countCharacterTopic}</p>
				</div>
			</div>
			{(channelLabelInit !== channelLabel || appUrlInit !== appUrl || topicInit !== topic) &&
				!checkValidate &&
				(!appUrl || !checkValidateUrl) && (
					<ModalAskChangeChannel onReset={handleReset} onSave={handleSave} className="relative mt-8 bg-transparent pr-0" />
				)}
		</div>
	);
};

export default OverviewChannel;
