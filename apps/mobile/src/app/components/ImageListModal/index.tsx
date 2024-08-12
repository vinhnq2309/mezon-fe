import { ImageGallery } from '@georstat/react-native-image-gallery';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ImageItem } from './ImageItem';
import { RenderFooterModal } from './RenderFooterModal';
import { RenderHeaderModal } from './RenderHeaderModal';

interface IImageListModalProps {
	visible?: boolean;
	onClose?: () => void;
	imageSelected?: ApiMessageAttachment;
}

export const ImageListModal = React.memo((props: IImageListModalProps) => {
	const { visible, onClose, imageSelected } = props;
	const { themeValue } = useTheme();

	const attachments = useSelector(selectAttachmentPhoto());
	const createAttachmentObject = (attachment: any) => ({
		id: `${attachment.create_time}_${attachment.url}`,
		url: attachment.url,
		uploader: attachment.uploader,
		create_time: attachment.create_time,
	});

	const formatAttachments: any[] = useMemo(() => {
		const imageSelectedUrl = imageSelected ? createAttachmentObject(imageSelected) : {};
		const attachmentObjects = attachments.filter((u) => u.url !== imageSelected?.url).map(createAttachmentObject);
		return [imageSelectedUrl, ...attachmentObjects];
	}, [attachments, imageSelected]);

	return (
		<ImageGallery
			close={onClose}
			isOpen={visible}
			thumbSize={size.s_24 * 3}
			disableSwipe
			images={formatAttachments}
			renderCustomImage={(item, index) => {
				return <ImageItem uri={item.url} key={`${index}_${item.url}_ImageModal`} onClose={onClose} />;
			}}
			thumbColor={themeValue.bgViolet}
			renderFooterComponent={(item, currentIndex) => {
				return <RenderFooterModal item={item} key={`${currentIndex}_${item.url}_RenderFooterModal`} />;
			}}
			renderHeaderComponent={() => <RenderHeaderModal onClose={onClose} />}
		/>
	);
});
