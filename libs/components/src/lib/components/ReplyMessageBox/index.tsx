import { emojiActions, selectMemberByUserId, selectMessageReplyState, selectReference, useAppDispatch } from '@mezon/store';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons/index';
import { useState } from 'react';


function ReplyMessageBox() {
	const dispatch = useAppDispatch();

	const refMessage = useSelector(selectReference);
	const getSenderMessage = useSelector(selectMemberByUserId(refMessage?.sender_id ?? ''));
    const messageReplyState = useSelector(selectMessageReplyState); 

	const handleRemoveReply = () => {
		dispatch(emojiActions.setMessageReplyState(false));
	};


	return (
		<>
			{messageReplyState && (
				<div className="flex flex-row items-center justify-between w-full my-2  bg-[#2B2D31] p-2 rounded-md text-[14px]">
					<div className="">
						Replying to <span className=" text-[#84ADFF] font-semibold">{getSenderMessage?.user?.username}</span>
					</div>
					<button className="relative iconHover" onClick={handleRemoveReply}>
						<Icons.CircleClose />
					</button>
				</div>
			)}
		</>
	);
}

export default ReplyMessageBox;
