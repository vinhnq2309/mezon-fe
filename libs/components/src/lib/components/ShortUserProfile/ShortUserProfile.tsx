import { useState } from 'react';
import ModalUserProfile from '../ModalUserProfile';
import { IMessageWithUser } from '@mezon/utils';
type ShortUserProfilePopup = {
	userID?: string;
	message?: IMessageWithUser;
};

const ShortUserProfile = ({ userID, message }: ShortUserProfilePopup) => {
	const [showPopupAddRole, setShowPopupAddRole] = useState(false);
	const handleClickOutside = () => {
		if (showPopupAddRole) {
			setShowPopupAddRole(false);
		}
	};
	return (
		<div className="relative">
			<div onClick={handleClickOutside} className="text-white w-full" role='button'>
				<ModalUserProfile userID={userID} classBanner='rounded-tl-lg rounded-tr-lg h-[105px]' message={message}/>
			</div>
		</div>
	);
};

export default ShortUserProfile;
