import ModalUserProfile from '../ModalUserProfile';

type ModalFooterProfileProps = {
	userId: string;
	avatar?: string;
};

const ModalFooterProfile = ({ userId, avatar }: ModalFooterProfileProps) => {
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={`fixed sbm:left-[50px] left-5 bottom-[70px] dark:bg-black bg-gray-200 mt-[10px] w-[340px] max-w-[89vw] rounded-lg flex flex-col z-10 opacity-100 shadow-md shadow-bgTertiary-500/40`}
		>
			<ModalUserProfile userID={userId} isFooterProfile avatar={avatar} />
		</div>
	);
};

export default ModalFooterProfile;
