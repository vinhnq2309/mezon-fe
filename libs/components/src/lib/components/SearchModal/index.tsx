import { useAppNavigation, useAuth, useChannels, useClans, useDirect, useFriends } from '@mezon/core';
import { InputField } from '@mezon/ui';
import { removeDuplicatesById } from '@mezon/utils';
import { Modal } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SuggestItem from '../MessageBox/ReactionMentionInput/SuggestItem';

export type SearchModalProps = {
	readonly open: boolean;
	onClose: () => void;
};

function SearchModal({ open, onClose }: SearchModalProps) {
	const { userProfile } = useAuth();
	const [searchText, setSearchText] = useState('');
	const accountId = userProfile?.user?.id ?? '';
	const { toDmGroupPageFromMainApp, toChannelPage, navigate } = useAppNavigation();
	const { createDirectMessageWithUser } = useDirect();
	const { listDM: dmGroupChatList } = useDirect();
	const { listChannels } = useChannels();
	const listGroup = dmGroupChatList.filter((groupChat) => groupChat.type === 2);
	const listDM = dmGroupChatList.filter((groupChat) => groupChat.type === 3);
	const { usersClan } = useClans();
	const { friends } = useFriends();

	const [idActive, setIdActive] = useState('');

	const listMemSearch = useMemo(() => {
		const listDMSearch = listDM.length
			? listDM.map((itemDM: any) => {
					return {
						id: itemDM?.user_id[0] ?? '',
						name: itemDM?.channel_label ?? '',
						avatarUser: itemDM?.channel_avatar[0] ?? '',
						idDM: itemDM?.id ?? '',
						typeChat: 3,
					};
				})
			: [];
		const listGroupSearch = listGroup.length
			? listGroup.map((itemGr: any) => {
					return {
						id: itemGr?.channel_id ?? '',
						name: itemGr?.channel_label ?? '',
						avatarUser: '/assets/images/avatar-group.png' ?? '',
						idDM: itemGr?.id ?? '',
						typeChat: 2,
					};
				})
			: [];
		const listFriendsSearch = friends.length
			? friends.map((itemFriend: any) => {
					return {
						id: itemFriend?.id ?? '',
						name: itemFriend?.user.username ?? '',
						avatarUser: itemFriend?.user.avatar_url ?? '',
						idDM: '',
					};
				})
			: [];
		const listUserClanSearch = usersClan.length
			? usersClan.map((itemUserClan: any) => {
					return {
						id: itemUserClan?.id ?? '',
						name: itemUserClan?.user?.username ?? '',
						avatarUser: itemUserClan?.user?.avatar_url ?? '',
						idDM: '',
					};
				})
			: [];
		const listSearch = [...listDMSearch, ...listFriendsSearch, ...listUserClanSearch, ...listGroupSearch];
		return removeDuplicatesById(listSearch.filter((item) => item.id !== accountId));
	}, [accountId, friends, listDM, listGroup, usersClan]);

	const listChannelSearch = useMemo(() => {
		const list = listChannels.map((item) => {
			return {
				id: item?.channel_id ?? '',
				name: item?.channel_label ?? '',
				subText: item?.category_name ?? '',
				icon: '#',
				clanId: item?.clan_id ?? '',
			};
		});
		return list;
	}, [listChannels]);

	const handleSelectMem = useCallback(
		async (user: any) => {
			if (user?.idDM) {
				const directChat = toDmGroupPageFromMainApp(user.idDM, user?.typeChat ?? 2);
				navigate(directChat);
			} else {
				const response = await createDirectMessageWithUser(user.id);
				if (response.channel_id) {
					const directChat = toDmGroupPageFromMainApp(response.channel_id, Number(response.type));
					navigate(directChat);
				}
			}
			onClose();
		},
		[createDirectMessageWithUser, navigate, onClose, toDmGroupPageFromMainApp],
	);

	const handleSelectChannel = useCallback(
		async (channel: any) => {
			const directChannel = toChannelPage(channel.id, channel.clanId);
			navigate(directChannel);
			onClose();
		},
		[navigate, onClose, toChannelPage],
	);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
		}
	};

	const isNoResult =
		!listChannelSearch.filter((item) => item.name.indexOf(searchText) > -1).length &&
		!listMemSearch.filter((item: any) => item.name.indexOf(searchText) > -1).length;

	useEffect(() => {
		const memSearchs = listMemSearch
			.filter((item: any) => item.name.indexOf(searchText.startsWith('@') ? searchText.substring(1) : searchText) > -1)
			.slice(0, searchText.startsWith('@') ? 25 : 7);
		const channelSearchs = listChannelSearch
			.filter((item) => item.name.indexOf(searchText.startsWith('#') ? searchText.substring(1) : searchText) > -1)
			.slice(0, searchText.startsWith('#') ? 25 : 8);
		const totalLists = memSearchs.concat(channelSearchs);

		if (idActive === '') {
			setIdActive(totalLists[0]?.id);
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			const nextIndex = (currentIndex: number, length: number) => (currentIndex === length - 1 ? 0 : currentIndex + 1);
			const prevIndex = (currentIndex: number) => (currentIndex === 0 ? totalLists.length - 1 : currentIndex - 1);
			const itemSelect = totalLists.find((item: any) => item.id === idActive);

			switch (event.key) {
				case 'ArrowDown':
					setIdActive(
						totalLists[
							nextIndex(
								totalLists.findIndex((item: any) => item.id === idActive),
								totalLists.length,
							)
						]?.id,
					);
					break;
				case 'ArrowUp':
					setIdActive(totalLists[prevIndex(totalLists.findIndex((item: any) => item.id === idActive))]?.id);
					break;
				case 'Enter':
					if (itemSelect.subText) {
						handleSelectChannel(totalLists.find((item: any) => item.id === idActive));
					} else {
						handleSelectMem(totalLists.find((item: any) => item.id === idActive));
					}
					break;

				default:
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleSelectChannel, handleSelectMem, idActive, listChannelSearch, listMemSearch, searchText]);

	return (
		<Modal
			show={open}
			dismissible={true}
			onClose={onClose}
			className="bg-[#111111] text-contentPrimary bg-opacity-90 focus-visible:[&>*]:outline-none"
		>
			<Modal.Body className="bg-[#36393e] px-6 py-4 rounded-[6px] h-[200px] w-full">
				<div className="flex flex-col">
					<InputField
						type="text"
						placeholder="Where would you like to go?"
						className="py-[18px] bg-bgTertiary text-[16px] mt-2 mb-[15px]"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => handleInputKeyDown(e)}
					/>
				</div>
				<div className="w-full max-h-[250px] overflow-x-hidden overflow-y-auto flex flex-col gap-[3px] pr-[5px] py-[10px]">
					{!searchText.startsWith('@') && !searchText.startsWith('#') ? (
						<>
							{listMemSearch.length
								? listMemSearch
										.filter((item: any) => item.name.indexOf(searchText) > -1)
										.slice(0, 7)
										.map((item: any, index: number) => {
											return (
												<div
													onClick={() => handleSelectMem(item)}
													onMouseEnter={() => setIdActive(item.id)}
													onMouseLeave={() => setIdActive(item.id)}
													className={`${idActive === item.id ? 'bg-bgModifierHover' : ''} hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
												>
													<SuggestItem name={item?.name} avatarUrl={item.avatarUser} />
												</div>
											);
										})
								: null}
							{listChannelSearch.length
								? listChannelSearch
										.filter((item) => item.name.indexOf(searchText) > -1)
										.slice(0, 8)
										.map((item: any) => {
											return (
												<div
													onClick={() => handleSelectChannel(item)}
													onMouseEnter={() => setIdActive(item.id)}
													onMouseLeave={() => setIdActive(item.id)}
													className={`${idActive === item.id ? 'bg-bgModifierHover' : ''} hover:bg-bgModifierHover w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
												>
													<SuggestItem name={item.name ?? ''} symbol={item.icon} subText={item.subText} />
												</div>
											);
										})
								: null}
							{isNoResult && <span className=" flex flex-row justify-center">Can't seem to find what you're looking for?</span>}
						</>
					) : (
						<>
							{searchText.startsWith('@') && (
								<>
									<span className="text-left opacity-60 text-[11px] pb-1 uppercase">Search friend and users</span>
									{listMemSearch.length ? (
										listMemSearch
											.filter((item: any) => item.name.indexOf(searchText.substring(1)) > -1)
											.slice(0, 25)
											.map((item: any) => {
												return (
													<div
														onClick={() => handleSelectMem(item)}
														className={`${idActive === item.id ? 'bg-bgModifierHover' : ''} hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
														onMouseEnter={() => setIdActive(item.id)}
														onMouseLeave={() => setIdActive(item.id)}
													>
														<SuggestItem name={item?.name} avatarUrl={item.avatarUser} />
													</div>
												);
											})
									) : (
										<></>
									)}
								</>
							)}
							{searchText.startsWith('#') && (
								<>
									<span className="text-left opacity-60 text-[11px] pb-1 uppercase">Searching channel</span>
									{listChannelSearch.length ? (
										listChannelSearch
											.filter((item) => item.name.indexOf(searchText.substring(1)) > -1)
											.slice(0, 25)
											.map((item: any) => {
												return (
													<div
														onClick={() => handleSelectChannel(item)}
														className={`${idActive === item.id ? 'bg-bgModifierHover' : ''} hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer`}
														onMouseEnter={() => setIdActive(item.id)}
														onMouseLeave={() => setIdActive(item.id)}
													>
														<SuggestItem name={item.name ?? ''} symbol={item.icon} subText={item.subText} />
													</div>
												);
											})
									) : (
										<></>
									)}
								</>
							)}
						</>
					)}
				</div>
				<div className="pt-2">
					<span className="text-[13px] font-medium text-contentTertiary">
						<span className="text-[#2DC770] opacity-100 font-bold">PROTIP: </span>Start searches with @, # to narrow down results.
					</span>
				</div>
			</Modal.Body>
		</Modal>
	);
}

export default SearchModal;
