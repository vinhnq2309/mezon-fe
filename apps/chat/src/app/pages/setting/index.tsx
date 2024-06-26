import { ExitSetting, Icons, SettingAccount, SettingAppearance, SettingItem, SettingRightProfile } from '@mezon/components';
import { useSettingFooter } from '@mezon/core';
import { selectIsShowSettingFooter } from '@mezon/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Setting = () => {
	const isShowSettingFooter = useSelector(selectIsShowSettingFooter);
	const [currentSetting, setCurrentSetting] = useState<string>(isShowSettingFooter?.initTab || 'Account');
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};
	const [menuIsOpen, setMenuIsOpen] = useState<boolean>(true);
	const handleMenuBtn = () => {
		setMenuIsOpen(!menuIsOpen);
	};
	const {setIsShowSettingFooterStatus, setIsShowSettingFooterInitTab} = useSettingFooter();
	const closeSetting = () => {
		setIsShowSettingFooterStatus(false);
		setIsShowSettingFooterInitTab('Account');
	}

	useEffect(() => {
		setCurrentSetting(isShowSettingFooter?.initTab || 'Account');
	},[isShowSettingFooter?.initTab]);
	return (
		<div>
			{isShowSettingFooter?.status ? (
				<div className=" z-10 flex fixed inset-0  w-screen">
					<div className="flex text-gray- w-screen relative">
						<div className={`${!menuIsOpen ? 'hidden' : 'flex'} text-gray- w-1/6 xl:w-1/4 min-w-56 relative`}>
							<SettingItem onItemClick={handleSettingItemClick} initSetting={currentSetting} />
						</div>
						{currentSetting === 'Account' && <SettingAccount menuIsOpen={menuIsOpen} onSettingProfile={handleSettingItemClick} />}
						{currentSetting === 'Profiles' && <SettingRightProfile menuIsOpen={menuIsOpen} />}
						{currentSetting === 'Appearance' && <SettingAppearance menuIsOpen={menuIsOpen} />}
						<ExitSetting onClose={closeSetting} />

						{menuIsOpen ? (
							<Icons.ArrowLeftCircleActive className='flex sbm:hidden absolute left-4 top-4 dark:text-[#AEAEAE] text-gray-500 w-[30px] h-[30px] hover:text-slate-400' onClick={handleMenuBtn}/>
						) : (
							<Icons.ArrowLeftCircle className='flex sbm:hidden absolute left-4 top-4 dark:text-[#AEAEAE] text-gray-500 w-[30px] h-[30px] hover:text-slate-400' onClick={handleMenuBtn}/>
						)}

						<div className="flex sbm:hidden absolute right-4 top-4" onClick={closeSetting}>
							<Icons.CloseIcon className="dark:text-[#AEAEAE] text-gray-500 w-[30px] h-[30px] hover:text-slate-400" />
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Setting;
