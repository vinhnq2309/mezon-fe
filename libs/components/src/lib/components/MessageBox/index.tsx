import { AttachmentPreviewThumbnail, MentionReactInput } from '@mezon/components';
import { useReference } from '@mezon/core';
import { useAppDispatch } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { IMessageSendPayload, MentionDataProps, SubPanelName } from '@mezon/utils';
import { ReactElement, useCallback } from 'react';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../Icons';
import FileSelectionButton from './FileSelectionButton';
import GifStickerEmojiButtons from './GifsStickerEmojiButtons';
// import ImageComponent from './ImageComponet';

export type MessageBoxProps = {
	onSend: (
		content: IMessageSendPayload,
		mentions?: Array<ApiMessageMention>,
		attachments?: Array<ApiMessageAttachment>,
		references?: Array<ApiMessageRef>,
	) => void;
	onTyping?: () => void;
	listMentions?: MentionDataProps[] | undefined;
	currentChannelId?: string;
	currentClanId?: string;
};

function MessageBox(props: MessageBoxProps): ReactElement {
	const { sessionRef, clientRef } = useMezon();
	const dispatch = useAppDispatch();
	const { onSend, onTyping, listMentions, currentChannelId, currentClanId } = props;
	// const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);
	const { attachmentDataRef, setAttachmentData } = useReference();

	const onConvertToFiles = useCallback((content: string) => {
		if (content.length > 2000) {
			const fileContent = new Blob([content], { type: 'text/plain' });
			const now = Date.now();
			const filename = now + '.txt';
			const file = new File([fileContent], filename, { type: 'text/plain' });
			const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;

			const session = sessionRef.current;
			const client = clientRef.current;

			if (!client || !session || !currentChannelId) {
				throw new Error('Client is not initialized');
			}
			handleUploadFile(client, session, fullfilename, file)
				.then((attachment) => {
					handleFinishUpload(attachment);
					return 'handled';
				})
				.catch((err) => {
					return 'not-handled';
				});
			return;
		}
	}, []);

	const handleFinishUpload = useCallback((attachment: ApiMessageAttachment) => {
		let urlFile = attachment.url;
		if (attachment.filetype?.indexOf('pdf') !== -1) {
			urlFile = '/assets/images/pdficon.png';
		} else if (attachment.filetype?.indexOf('text') !== -1) {
			urlFile = '/assets/images/text.png';
		} else if (attachment.filetype.indexOf('image/png') !== -1) {
			urlFile === attachment.url;
		}
		setAttachmentData(attachment);
	}, []);

	function removeAttachmentByUrl(attachments: ApiMessageAttachment[], urlToRemove: string): ApiMessageAttachment[] {
		console.log('remove');
		return attachments.filter((attachment) => attachment.url !== urlToRemove);
	}

	const onPastedFiles = useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>) => {
			const items = (event.clipboardData || (window as any).clipboardData).items;
			const files: Blob[] = [];
			if (items) {
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf('image') !== -1) {
						const file = items[i].getAsFile();
						if (file) {
							files.push(file);
						}
					}
				}

				if (files.length > 0) {
					const blob = new Blob(files, { type: files[0].type });
					const filename = Date.now() + '.png';
					const file = new File([blob], filename, { type: blob.type });
					const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;
					const session = sessionRef.current;
					const client = clientRef.current;

					if (!client || !session || !currentClanId) {
						throw new Error('Client is not initialized');
					}
					handleUploadFile(client, session, fullfilename, file)
						.then((attachment) => {
							handleFinishUpload(attachment);
							return 'handled';
						})
						.catch((err) => {
							return 'not-handled';
						});

					return 'not-handled';
				}
			}
		},
		[attachmentDataRef, clientRef, currentChannelId, currentClanId, sessionRef],
	);

	return (
		<div className="relative">
			<div className="w-full gap-2 border flex flex-row h-fit overflow-x-scroll">
				{attachmentDataRef.map((item, index) => {
					return (
						<>
							<AttachmentPreviewThumbnail attachment={item} onRemove={() => removeAttachmentByUrl} />
						</>
					);
				})}
			</div>
			<div className="flex flex-inline w-max-[97%] items-end gap-2 box-content mb-4 bg-black rounded-md relative">
				<FileSelectionButton
					currentClanId={currentClanId || ''}
					currentChannelId={currentChannelId || ''}
					onFinishUpload={handleFinishUpload}
				/>

				<div className={`w-full bg-black gap-3 flex items-center rounded-e-md`}>
					<div className={`w-[96%] bg-black gap-3 relative`}>
						<MentionReactInput
							handlePaste={onPastedFiles}
							listMentions={props.listMentions}
							onSend={props.onSend}
							onTyping={props.onTyping}
						/>
					</div>
					<GifStickerEmojiButtons activeTab={SubPanelName.NONE} />
				</div>
			</div>
		</div>
	);
}

MessageBox.Skeleton = () => {
	return (
		<div className="self-stretch h-fit px-4 mb-[8px] mt-[8px] flex-col justify-end items-start gap-2 flex overflow-hidden">
			<form className="self-stretch p-4 bg-neutral-950 rounded-lg justify-start gap-2 inline-flex items-center">
				<div className="flex flex-row h-full items-center">
					<div className="flex flex-row  justify-end h-fit">
						<Icons.AddCircle />
					</div>
				</div>

				<div className="grow self-stretch justify-start items-center gap-2 flex">
					<div
						contentEditable
						className="grow text-white text-sm font-['Manrope'] placeholder-[#AEAEAE] h-fit border-none focus:border-none outline-none bg-transparent overflow-y-auto resize-none "
					/>
				</div>
				<div className="flex flex-row h-full items-center gap-1 mr-2 w-12 rounded-r-lg">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</form>
		</div>
	);
};

export default MessageBox;
