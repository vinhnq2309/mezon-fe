import { handleUploadFile, useMezon } from '@mezon/transport';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import * as Icons from '../../../../../ui/src/lib/Icons';
import { useReference } from '@mezon/core';

export type FileSelectionButtonProps = {
	currentClanId: string;
	currentChannelId: string;
	onFinishUpload: (attachment: ApiMessageAttachment) => void;
};
function FileSelectionButton({ currentClanId, currentChannelId, onFinishUpload }: FileSelectionButtonProps) {
	const { sessionRef, clientRef } = useMezon();
	const { setStatusLoadingAttachment } = useReference();

	const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStatusLoadingAttachment(true);
		const files = e.target.files;
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!files || !client || !session || !currentChannelId) {
			throw new Error('Client or files are not initialized');
		}

		const promises = Array.from(files).map((file) => {
			return handleUploadFile(client, session, currentClanId, currentChannelId, file.name, file);
		});
		Promise.all(promises).then((attachments) => {
			attachments.forEach((attachment) => onFinishUpload(attachment));
		}).then(() => {
			setStatusLoadingAttachment(false);
		});
	};

	return (
		<label>
			<input
				id="preview_img"
				type="file"
				onChange={(e) => {
					handleFiles(e);
					e.target.value = '';
				}}
				className="w-full hidden"
				multiple
			/>
			<div className="flex flex-row h-6 w-6 items-center justify-center ml-2 mb cursor-pointer">
				<Icons.AddCircle />
			</div>
		</label>
	);
}

export default FileSelectionButton;
