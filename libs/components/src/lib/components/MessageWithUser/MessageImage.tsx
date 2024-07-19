import { useAttachments } from '@mezon/core';
import { attachmentActions } from '@mezon/store';
import { checkLinkImageWork, notImplementForGifOrStickerSendFromPanel, SHOW_POSITION } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMessageContextMenu } from '../ContextMenu';

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
	const { setImageURL, setPositionShow } = useMessageContextMenu();

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

	const [imageWork, setImageWork] = useState(false);

	const handleContextMenu = useCallback(
		(e: any) => {
			setImageURL(attachmentData?.url ?? '');
			setPositionShow(SHOW_POSITION.NONE);
			if (typeof onContextMenu === 'function') {
				onContextMenu((e || {}) as React.MouseEvent<HTMLImageElement>);
			}
		},
		[attachmentData?.url, onContextMenu, setImageURL, setPositionShow],
	);

	useMemo(() => {
		checkLinkImageWork(attachmentData.url ?? '').then((result) => {
			setImageWork(result);
		});
	}, [attachmentData.url]);

	return (
		<div className="break-all">
			{imageWork ? (
				<img
					onContextMenu={handleContextMenu}
					className={
						'max-w-[100%] max-h-[30vh] object-cover my-2 rounded ' +
						(!isDimensionsValid && !checkImage ? 'cursor-pointer' : 'cursor-default')
					}
					src={attachmentData.url?.toString()}
					alt={attachmentData.url}
					onClick={() => handleClick(attachmentData.url || '')}
					style={imgStyle}
				/>
			) : null}
		</div>
	);
}

export default MessageImage;
