import { useShowName } from '@mezon/core';
import { referencesActions } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { blankReferenceObj } from '@mezon/utils';
import { ApiMessageRef } from 'mezon-js/api.gen';
import { useDispatch } from 'react-redux';

type MessageReplyProps = {
	channelId: string;
	dataReferences: ApiMessageRef;
};

function ReplyMessageBox({ channelId, dataReferences }: MessageReplyProps) {
	const dispatch = useDispatch();
	const nameShowed = useShowName(
		dataReferences.message_sender_clan_nick ?? '',
		dataReferences.message_sender_display_name ?? '',
		dataReferences.message_sender_username ?? '',
		dataReferences.message_sender_id ?? ''
	);

	const handleRemoveReply = () => {
		dispatch(
			referencesActions.setDataReferences({
				channelId: channelId,
				dataReferences: blankReferenceObj
			})
		);
	};

	return (
		<div className="flex flex-row items-center justify-between w-full my-2 dark:bg-[#2B2D31] bg-bgLightMode p-2 rounded-md text-[14px]">
			<div className="dark:text-white text-black">
				Replying to <span className=" dark:text-[#84ADFF] text-[#3297ff] font-semibold">{nameShowed}</span>
			</div>
			<button className="relative" onClick={handleRemoveReply}>
				<Icons.CircleClose />
			</button>
		</div>
	);
}

export default ReplyMessageBox;
