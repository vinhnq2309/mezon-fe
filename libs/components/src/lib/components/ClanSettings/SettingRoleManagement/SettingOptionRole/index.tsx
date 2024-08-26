import { useClanOwner } from '@mezon/core';
import { RolesClanEntity, getSelectedRoleId, selectAllRolesClan, selectEveryoneRole, toggleIsShowFalse } from '@mezon/store';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckHasAdministrator } from '../../SettingMainRoles/listActiveRole';
import SettingDisplayRole from '../SettingDisplayRole';
import SettingManageMembers from '../SettingManageMembers';
import SettingPermissions from '../SettingPermissions';
import { TabsSelectRole } from './tabSelectRole';

enum RoleTabs {
	Display_Tab = "Display",
	Permission_Tab = "Permissions",
	Manage_Tab = "Manage Members",
}

const SettingValueDisplayRole = ({ RolesClan }: { RolesClan: RolesClanEntity[] }) => {
	const [selectedButton, setSelectedButton] = useState<string | null>(RoleTabs.Permission_Tab);
	const everyoneRole = useSelector(selectEveryoneRole);
	const clickRole = useSelector(getSelectedRoleId);
	const activeRole = useMemo(() => RolesClan.find((role) => role.id === clickRole), [RolesClan, clickRole]);
	const isClanOwner = useClanOwner();
	const hasPermissionAdmin = useCheckHasAdministrator(activeRole?.permission_list?.permissions);
	const hasPermissionEdit = isClanOwner || !hasPermissionAdmin;
	const dispatch = useDispatch();
	const handleButtonClick = (buttonName: string) => {
		setSelectedButton(buttonName);
	};

	const renderContent = useCallback(() => {
    if(everyoneRole?.id === clickRole){
      return <SettingPermissions RolesClan={RolesClan} hasPermissionEdit={hasPermissionEdit} />;
    }
		switch (selectedButton) {
			case TabsSelectRole.Tab_Display:
				return <SettingDisplayRole RolesClan={RolesClan} hasPermissionEdit={hasPermissionEdit}/>;
			case TabsSelectRole.Tab_Permissions:
				return <SettingPermissions RolesClan={RolesClan} hasPermissionEdit={hasPermissionEdit} />;
			case TabsSelectRole.Tab_Manage_Members:
				return <SettingManageMembers RolesClan={RolesClan} hasPermissionEdit={hasPermissionEdit} />;
			default:
				return null;
		}
	  }, [selectedButton, RolesClan, hasPermissionEdit,clickRole]);

	const roleUsersCount = activeRole?.role_user_list?.role_users?.length || 0;

	const isSelectDisplayTab = selectedButton === RoleTabs.Display_Tab;
	const isSelectPermissionTab = selectedButton === RoleTabs.Permission_Tab || everyoneRole?.id === clickRole;
	const isSelectManageTab = selectedButton === RoleTabs.Manage_Tab;

	return (
		<>
			<div className="pr-5">
				<div className="w-full flex justify-between mb-5 border-b border-gray-200 dark:border-gray-500">
					{
						clickRole !== everyoneRole?.id &&
						<button
							className={`py-[5px] text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group ${isSelectDisplayTab ? 'dark:text-white text-black' : 'text-contentTertiary'}`}
							onClick={() => {
								handleButtonClick('Display');
								dispatch(toggleIsShowFalse());
							}}
						>
							Display
							<div
								className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${isSelectDisplayTab ? 'bg-blue-400' : ''}`}
							/>
						</button>
					}

					<button
						className={`py-[5px] text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group ${isSelectPermissionTab ? 'dark:text-white text-black' : 'text-contentTertiary'}`}
						onClick={() => {
							handleButtonClick('Permissions');
							dispatch(toggleIsShowFalse());
						}}
					>
						Permissions
						<div
							className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${isSelectPermissionTab ? 'bg-blue-400' : ''}`}
						/>
					</button>
					{
						clickRole !== everyoneRole?.id &&
						<button
							className={`py-[5px] text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group ${isSelectManageTab ? 'dark:text-white text-black' : 'text-contentTertiary'}`}
							onClick={() => {
								handleButtonClick('Manage Members');
								dispatch(toggleIsShowFalse());
							}}
						>
							Manage Members ({roleUsersCount > 0 ? roleUsersCount : 0})
							<div
								className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${isSelectManageTab ? 'bg-blue-400' : ''}`}
							/>
						</button>
					}
				</div>
			</div>
			
			{renderContent()}
		</>
	);
};

export default SettingValueDisplayRole;
