import { useRef, useState } from 'react';
import { OfflineStatus, OnlineStatus } from '../Icons';
import { ShortUserProfile } from '@mezon/components'
import { useOnClickOutside } from '@mezon/core';
import { ChannelMembersEntity, selectCurrentChannel } from '@mezon/store';
export type MemberProfileProps = {
	avatar: string;
	name: string;
	status?: boolean;
	isHideStatus?: boolean;
	isHideIconStatus?: boolean;
	numberCharacterCollapse?: number;
	textColor?: string;
	isHideUserName?: boolean;
	classParent?: string;
	user?: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
};

function MemberProfile({
	avatar,
	name,
	status,
	isHideStatus,
	isHideIconStatus,
	numberCharacterCollapse = 6,
	textColor = 'contentSecondary',
	isHideUserName,
	classParent = '',
	user,
	listProfile,
	isOffline,
}: MemberProfileProps) {
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		if (event.button === 0) {
			setIsShowPanelChannel(true)
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	return (
		<div ref={panelRef} onMouseDown={(event) => handleMouseClick(event)} className="relative group">
				<div className={`relative gap-[5px] flex items-center cursor-pointer rounded ${classParent} ${isOffline ? 'opacity-60':''}`}>
					<a className="mr-[2px] relative inline-flex items-center justify-start w-10 h-10 text-lg text-white rounded-full">
						{avatar ? (
							<img src={avatar} className="w-[38px] h-[38px] min-w-[38px] rounded-full object-cover" />
						) : (
							<div className="w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
								{name.charAt(0).toUpperCase()}
							</div>
						)}
						{!isHideIconStatus && avatar !== '/assets/images/avatar-group.png' ? (
							<span
								className={`absolute bottom-[-1px] right-[-1px] inline-flex items-center justify-center gap-1 p-[3px] text-sm text-white bg-[#111] rounded-full`}
							>
								{status ? <OnlineStatus /> : <OfflineStatus />}
							</span>
						) : (
							<></>
						)}
					</a>
					<div className="flex flex-col items-start">
						<div className="absolute top-6 group-hover:-translate-y-4 transition-all duration-300 flex flex-col items-start">
							{!isHideStatus && (
								<>
									<span className={`text-[11px] text-${textColor}`}>{!status ? 'Offline' : 'Online'}</span>
									<p className="text-[11px] text-contentSecondary">{name}</p>
								</>
							)}
						</div>
						{!isHideUserName && (
							<p
								className={`text-[15px] ${classParent == '' ? 'bg-transparent' : 'relative top-[-7px] bg-bgSurface'} nameMemberProfile`}
								title={name && name.length > numberCharacterCollapse ? name : undefined}
							>
								{name && name.length > numberCharacterCollapse ? `${name.substring(0, numberCharacterCollapse)}...` : name}
							</p>
						)}
					</div>
				</div>
				{isShowPanelChannel && listProfile ?(
				<div
					className="bg-black mt-[10px]  rounded-lg flex flex-col z-10 absolute top-0 right-[180px] opacity-100">
						<ShortUserProfile userID={user?.user?.id|| ''}/>
				</div>
				):null}
		</div>
	);
}

export default MemberProfile;
