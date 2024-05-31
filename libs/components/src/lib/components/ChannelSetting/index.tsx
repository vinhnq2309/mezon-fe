import { IChannel } from '@mezon/utils';
import { useState } from 'react';
import IntegrationsChannel from './Component/IntegrationsChannel';
import InvitesChannel from './Component/InvitesChannel';
import OverviewChannel from './Component/OverviewChannel';
import PermissionsChannel from './Component/PermissionsChannel';
import ChannelSettingItem from './channelSettingItem';
import ExitSetting from './exitSetting';
import * as Icons from '../Icons';
import { useMenu } from '@mezon/core';

export type ModalSettingProps = {
	open: boolean;
	onClose: () => void;
	channel: IChannel;
};

const SettingChannel = (props: ModalSettingProps) => {
	const { open, onClose, channel } = props;
	const [currentSetting, setCurrentSetting] = useState<string>('Overview');
	const [menu, setMenu] = useState(true);

	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
		if(closeMenu){
			setMenu(false);
		}
	};

	const { closeMenu } = useMenu();

	return (
		<div>
			{open ? (
				<div className="flex fixed inset-0  w-screen z-10">
					<div className="flex text-gray- w-screen relative text-white">
						<div className='h-fit absolute top-5 right-5 block sbm:hidden z-[1]'>
							<button
								className="bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out"
								onClick={onClose}
							>
							X
							</button>
						</div>
						<div className='h-fit absolute top-5 left-5 block sbm:hidden z-[1]'>
							<button
								className={`bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out flex justify-center items-center ${menu ? 'rotate-90' : '-rotate-90'}`}
								onClick={() => setMenu(!menu)}
							>
								<Icons.ArrowDown defaultFill="white" defaultSize="w-[20px] h-[30px]" />
							</button>
						</div>
						<ChannelSettingItem onItemClick={handleSettingItemClick} channel={channel} onCloseModal={onClose} stateClose={closeMenu} stateMenu={menu}/>
						{currentSetting === 'Overview' && <OverviewChannel channel={channel} />}
						{currentSetting === 'Permissions' && <PermissionsChannel channel={channel} />}
						{currentSetting === 'Invites' && <InvitesChannel />}
						{currentSetting === 'Integrations' && <IntegrationsChannel />}
						<ExitSetting onClose={onClose} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default SettingChannel;
