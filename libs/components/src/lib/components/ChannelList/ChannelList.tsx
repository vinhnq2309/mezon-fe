import { useAppNavigation, useCategorizedChannels, usePathMatch } from '@mezon/core';
import {
	ClansEntity,
	selectAllChannelsFavorite,
	selectChannelById,
	selectCurrentClan,
	selectIsShowEmptyCategory,
	selectStatusStream,
	selectTheme
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelStatusEnum, ICategoryChannel } from '@mezon/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChannelType } from 'mezon-js';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateNewChannelModal } from '../CreateChannelModal';
import CategorizedChannels from './CategorizedChannels';
import { Events } from './ChannelListComponents';
import { ChannelListItemRef } from './ChannelListItem';
export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function ChannelList() {
	const appearanceTheme = useSelector(selectTheme);
	return (
		<div
			onContextMenu={(event) => event.preventDefault()}
			className={`overflow-y-scroll overflow-x-hidden w-[100%] h-[100%] pb-[10px] ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
			id="channelList"
			role="button"
		>
			{<CreateNewChannelModal />}
			<hr className="h-[0.08px] w-full dark:border-borderDivider border-white mx-2" />
			<div className={`overflow-y-scroll flex-1 pt-3 space-y-[21px]  text-gray-300 scrollbar-hide`}>
				<RowVirtualizerDynamic appearanceTheme={appearanceTheme} />
			</div>
		</div>
	);
}

const ChannelBannerAndEvents = memo(({ currentClan }: { currentClan: ClansEntity | null }) => {
	const memberPath = `/chat/clans/${currentClan?.id}/member-safety`;
	const channelSettingPath = `/chat/clans/${currentClan?.id}/channel-setting`;
	const { isMemberPath, isSettingPath } = usePathMatch({ isMemberPath: memberPath, isSettingPath: channelSettingPath });
	return (
		<>
			{currentClan?.banner && (
				<div className="h-[136px]">
					<img src={currentClan?.banner} alt="imageCover" className="h-full w-full object-cover" />
				</div>
			)}
			<div id="channel-list-top" className="self-stretch h-fit flex-col justify-start items-start gap-1 p-2 flex">
				<Events isMemberPath={isMemberPath} isSettingPath={isSettingPath} />
			</div>
		</>
	);
});

const RowVirtualizerDynamic = memo(({ appearanceTheme }: { appearanceTheme: string }) => {
	const channelRefs = useRef<Record<string, ChannelListItemRef | null>>({});
	const categorizedChannels = useCategorizedChannels();
	const currentClan = useSelector(selectCurrentClan);
	const isShowEmptyCategory = useSelector(selectIsShowEmptyCategory);
	const streamPlay = useSelector(selectStatusStream);

	const data = useMemo(
		() => [
			{ type: 'bannerAndEvents' },
			{ type: 'favorites' },
			...(isShowEmptyCategory ? categorizedChannels : categorizedChannels.filter((item) => item.channels.length !== 0))
		],
		[categorizedChannels, isShowEmptyCategory]
	) as ICategoryChannel[];

	const parentRef = useRef<HTMLDivElement>(null);
	const count = data.length;
	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 45
	});

	const items = virtualizer.getVirtualItems();

	const [height, setHeight] = useState(0);
	const clanTopbarEle = 60;
	useEffect(() => {
		const calculateHeight = () => {
			const clanFooterEle = document.getElementById('clan-footer');
			const totalHeight = clanTopbarEle + (clanFooterEle?.clientHeight || 0) + 25;
			const outsideHeight = totalHeight;
			setHeight(window.innerHeight - outsideHeight);
		};
		calculateHeight();
		window.addEventListener('resize', calculateHeight);
		return () => window.removeEventListener('resize', calculateHeight);
	}, [data, streamPlay]);

	const channelFavorites = useSelector(selectAllChannelsFavorite);
	const [isExpandFavorite, setIsExpandFavorite] = useState<boolean>(true);

	const handleExpandFavoriteChannel = () => {
		setIsExpandFavorite(!isExpandFavorite);
	};

	return (
		<div
			ref={parentRef}
			style={{
				height: height,
				overflowY: 'auto',
				contain: 'strict'
			}}
			className={`custom-member-list ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
		>
			<div
				style={{
					height: virtualizer.getTotalSize(),
					width: '100%',
					position: 'relative'
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						transform: `translateY(${items[0]?.start ?? 0}px)`
					}}
				>
					{items.map((virtualRow) => {
						const item = data[virtualRow.index];
						if (virtualRow.index === 0) {
							return (
								<div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
									<ChannelBannerAndEvents currentClan={currentClan} />
								</div>
							);
						} else if (virtualRow.index === 1) {
							return (
								<div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
									<FavoriteChannelsSection
										isExpandFavorite={isExpandFavorite}
										handleExpandFavoriteChannel={handleExpandFavoriteChannel}
										channelFavorites={channelFavorites}
										channelRefs={channelRefs}
									/>
								</div>
							);
						} else {
							return (
								<div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
									<div style={{ padding: '10px 0' }}>
										<div>
											<CategorizedChannels key={item.id} category={item} channelRefs={channelRefs} />
										</div>
									</div>
								</div>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
});

const FavoriteChannelsSection = ({
	isExpandFavorite,
	handleExpandFavoriteChannel,
	channelFavorites,
	channelRefs
}: {
	isExpandFavorite: boolean;
	handleExpandFavoriteChannel: () => void;
	channelFavorites: string[];
	channelRefs: React.RefObject<Record<string, ChannelListItemRef | null>>;
}) => (
	<div>
		<div
			className="dark:text-channelTextLabel text-colorTextLightMode flex items-center px-0.5 w-full font-title tracking-wide dark:hover:text-gray-100 hover:text-black uppercase text-sm font-semibold px-2"
			onClick={handleExpandFavoriteChannel}
		>
			{isExpandFavorite ? <Icons.ArrowDown /> : <Icons.ArrowRight />}
			<span className="one-line">Favorite channel</span>
		</div>
		{isExpandFavorite ? (
			<div className="w-[94%] mx-auto">
				{channelFavorites
					? channelFavorites.map((id, index) => (
							<FavoriteChannel key={index} channelId={id} channelRef={channelRefs?.current?.[id] || null} />
						))
					: ''}
			</div>
		) : null}
	</div>
);
type FavoriteChannelProps = {
	channelId: string;
	channelRef: ChannelListItemRef | null;
};

const FavoriteChannel = ({ channelId, channelRef }: FavoriteChannelProps) => {
	const channel = useSelector(selectChannelById(channelId));
	const theme = useSelector(selectTheme);
	const { navigate, toChannelPage } = useAppNavigation();
	const handleJumpChannel = (id: string, clanId: string) => {
		if (channelRef) {
			channelRef.scrollIntoChannel();
		}
		navigate(toChannelPage(id, clanId));
	};

	return (
		<div>
			{channel ? (
				<div
					onClick={() => handleJumpChannel(channel.channel_id || '', channel.clan_id || '')}
					className="flex gap-2 rounded-md w-full px-2 py-1 mt-1 items-center hover:dark:bg-bgModifierHover hover:bg-bgModifierHoverLight"
				>
					<div className={`relative  ${channel.type !== ChannelType.CHANNEL_TYPE_STREAMING ? 'mt-[-5px]' : ''}`}>
						{channel.channel_private === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
							<Icons.SpeakerLocked defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						)}
						{channel.channel_private === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_TEXT && (
							<Icons.HashtagLocked defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						)}
						{channel.channel_private === undefined && channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
							<Icons.Speaker defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						)}
						{channel.channel_private !== 1 && channel.type === ChannelType.CHANNEL_TYPE_TEXT && (
							<Icons.Hashtag defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						)}
						{channel.channel_private === undefined && channel.type === ChannelType.CHANNEL_TYPE_STREAMING && (
							<Icons.Stream defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						)}
						{channel.type === ChannelType.CHANNEL_TYPE_APP && <Icons.AppChannelIcon className={'w-5 h-5'} fill={theme} />}
					</div>
					{channel.channel_label}
				</div>
			) : null}
		</div>
	);
};
export default memo(ChannelList, () => true);
