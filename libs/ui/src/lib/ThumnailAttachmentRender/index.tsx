import { Icons, MessageImage, MessageVideo } from '@mezon/components';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';

export const RenderAttachmentThumbnail = (attachment: ApiMessageAttachment, size: string, pos?: string) => {
	const fileType = attachment.filetype;
	const fileName = attachment.filename;
	const icons = [
		{
			condition: fileType?.indexOf('text') !== -1,
			component: pos === '' ? <MessageImage attachmentData={attachment} /> : <Icons.TxtThumbnail key="txt-thumbnail" defaultSize={size} />,
		},
		{
			condition: fileType?.indexOf('pdf') !== -1,
			component: <Icons.PdfThumbnail key="pdf-thumbnail" defaultSize={size} />,
		},
		{
			condition: fileType?.indexOf('image') !== -1,
			component: <img key="image-thumbnail" src={attachment.url} role="presentation" className="w-48" alt={attachment.url} />,
		},

		{
			condition: fileType?.indexOf('application/msword') !== -1,
			component: <Icons.DocThumbnail key="doc-thumbnail" defaultSize={size} />,
		},
		{
			condition:
				fileType?.indexOf('application/vnd.ms-excel') !== -1 ||
				fileType?.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1,
			component: <Icons.XlsThumbnail key="xls-thumbnail" defaultSize={size} />,
		},
		{
			condition: fileName && fileName.toLowerCase().endsWith('.rar'),
			component: <Icons.RarThumbnail key="rar-thumbnail" defaultSize={size} />,
		},
		{
			condition: fileType?.indexOf('video/mp4') !== -1,
			component: (
				<div className={`w-35 h-32 flex flex-row justify-center items-center relative mt-[-10px]`}>
					<MessageVideo attachmentData={attachment} />
				</div>
			),
		},
	];
	return icons.filter((icon) => icon.condition).map((icon, index) => React.cloneElement(icon.component, { key: `${icon.component.key}-${index}` }));
};
