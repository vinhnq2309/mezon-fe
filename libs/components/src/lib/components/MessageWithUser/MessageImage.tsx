import { useAttachments } from '@mezon/core';
import { attachmentActions } from '@mezon/store';
import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
	onContextMenu?: (event: React.MouseEvent<HTMLImageElement>) => void;
	mode?: ChannelStreamMode;
	messageId?: string;
};

function MessageImage({ attachmentData, onContextMenu, mode, messageId }: MessageImage) {
	const dispatch = useDispatch();
	const { setOpenModalAttachment, setAttachment } = useAttachments();
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);

	const handleClick = (url: string) => {
		if (!isDimensionsValid && !checkImage) {
			setOpenModalAttachment(true);
			setAttachment(url);
			dispatch(attachmentActions.setMode(mode));
			dispatch(attachmentActions.setMessageId(messageId));
		}
	};
	const imgStyle = {
		width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
		height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
	};

	const [imageError, setImageError] = useState(false);

	const handleImageError = () => {
		setImageError(true);
	};

	if (imageError || !attachmentData.url) {
		return null;
	}
	return (
		<>
			{attachmentData.url ? (
				<div className="break-all">
					<img
						onContextMenu={onContextMenu}
						className={
							'max-w-[100%] max-h-[30vh] object-cover my-2 rounded ' +
							(!isDimensionsValid && !checkImage ? 'cursor-pointer' : 'cursor-default')
						}
						src={attachmentData.url?.toString()}
						alt={attachmentData.url}
						onClick={() => handleClick(attachmentData.url || '')}
						style={imgStyle}
						onError={handleImageError}
					/>
				</div>
			) : null}
		</>
	);
}

export default MessageImage;
