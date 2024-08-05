import { useRoles } from '@mezon/core';
import { RolesClanEntity, getNewAddMembers, getSelectedRoleId, selectAllUsesClan, selectCurrentClan, selectTheme, setAddMemberRoles } from '@mezon/store';
import { InputField } from '@mezon/ui';
import { ThemeApp, UsersClanEntity } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarImage } from '../../../AvatarImage/AvatarImage';
import { AddMembersModal } from '../AddMembersModal';

const SettingManageMembers = ({ RolesClan, hasPermissionEdit }: { RolesClan: RolesClanEntity[], hasPermissionEdit: boolean }) => {
	const { updateRole } = useRoles();
	const dispatchRole = useDispatch();
	const currentClan = useSelector(selectCurrentClan);
	const addUsers: string[] = useSelector(getNewAddMembers);
	const clickRole = useSelector(getSelectedRoleId);
	const usersClan = useSelector(selectAllUsesClan);
	const [searchTerm, setSearchTerm] = useState('');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const activeRole = RolesClan.find((role) => role.id === clickRole);
	const commonUsers = usersClan.filter((user) => addUsers.includes(user.id));

	const [searchResults, setSearchResults] = useState<any[]>(commonUsers);
	const handleOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	useEffect(() => {
		const results = commonUsers?.filter((member) => member.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()));
		setSearchResults(results || []);
	}, [searchTerm, addUsers, clickRole]);

	useEffect(() => {
		if (clickRole !== 'New Role') {
			const memberIDRoles = activeRole?.role_user_list?.role_users?.map((member) => member.id) || [];
			dispatchRole(setAddMemberRoles(memberIDRoles));
		}
	}, [activeRole, clickRole, dispatchRole]);

	const handleRemoveMember = async (userID: string) => {
		const userIDArray = userID?.split(',');
		await updateRole(currentClan?.id ?? '', clickRole, activeRole?.title ?? '', [], [], userIDArray, []);
	};
	const appearanceTheme = useSelector(selectTheme);
	return (
		<div style={{pointerEvents: !hasPermissionEdit ? undefined : 'none'}}>
			<div className="w-full flex gap-x-3">
				<InputField
					className="flex-grow dark:bg-bgTertiary bg-bgLightModeThird text-[15px] w-full py-1 px-2 font-normal border dark:border-bgTertiary border-bgLightModeThird rounded"
					type="text"
					placeholder="Search Members"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button
					className="flex-grow text-[15px] bg-blue-600 hover:bg-blue-500 rounded py-[3px] px-2 text-nowrap font-medium text-white"
					onClick={() => {
						handleOpenModal();
					}}
				>
					Add Members
				</button>
			</div>
			<br />
			<div className={appearanceTheme === ThemeApp.Light ? 'lightModeScrollBarMention' : ''}>
				<ul className="flex flex-col gap-y-4 max-h-listMemberRole overflow-y-auto">
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
					{searchResults.map((member: UsersClanEntity) => (
						<li key={member?.user?.id} className="flex justify-between items-center group">
							<div className="flex gap-x-2">
								<AvatarImage 
									alt={member?.user?.username || ''}
									userName={member?.user?.username}
									className="min-w-6 min-h-6 max-w-6 max-h-6"
									src={member?.user?.avatar_url}
								/>
								<span className="dark:text-white text-black font-medium">{member?.user?.display_name}</span>
								<span className="dark:text-colorNeutral text-colorTextLightMode font-light">{member?.user?.username}</span>
							</div>
							{clickRole !== 'New Role' ? (
								<div className="w-4 h-4 rounded-full flex justify-center items-center group-hover:bg-slate-800">
									<span
										onClick={() => handleRemoveMember(member?.user?.id || '')}
										className="text-white cursor-pointer"
										role="button"
									>
										x
									</span>
								</div>
							) : null}
						</li>
					))}
				</ul>
			</div>
			<AddMembersModal isOpen={openModal} onClose={handleCloseModal} RolesClan={RolesClan} />
		</div>
	);
};

export default SettingManageMembers;
