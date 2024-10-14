import { Avatar } from 'flowbite-react';
import React, { Fragment, memo, useImperativeHandle, useMemo, useRef } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';

import {
	selectCategoryExpandStateByCategoryId,
	selectIsUnreadChannelById,
	selectStreamMembersByChannelId,
	selectVoiceChannelMembersByChannelId
} from '@mezon/store';

import { ChannelThreads } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { ChannelLink, ChannelLinkRef } from '../../ChannelLink';
import { AvatarUser } from '../../ClanSettings/SettingChannel';
import ModalInvite from '../../ListMemberInvite/modalInvite';
import ThreadListChannel, { ListThreadChannelRef } from '../../ThreadListChannel';
import UserListVoiceChannel from '../../UserListVoiceChannel';
import { IChannelLinkPermission } from '../CategorizedChannels';

type ChannelListItemProp = {
	channel: ChannelThreads;
	isActive: boolean;
	permissions: IChannelLinkPermission;
	isCollapsed: boolean;
};

export type ChannelListItemRef = {
	scrollIntoChannel: (options?: ScrollIntoViewOptions) => void;
	scrollIntoThread: (threadId: string, options?: ScrollIntoViewOptions) => void;
};

const ChannelListItem = React.forwardRef<ChannelListItemRef | null, ChannelListItemProp>((props, ref) => {
	const { channel, isActive, permissions, isCollapsed } = props;
	const isUnreadChannel = useSelector((state) => selectIsUnreadChannelById(state, channel.id));
	const voiceChannelMembers = useSelector(selectVoiceChannelMembersByChannelId(channel.id));
	const streamChannelMembers = useSelector(selectStreamMembersByChannelId(channel.id));
	const memberList = useMemo(() => {
		if (channel.type === ChannelType.CHANNEL_TYPE_VOICE) return voiceChannelMembers;
		if (channel.type === ChannelType.CHANNEL_TYPE_STREAMING) return streamChannelMembers;
		return [];
	}, [voiceChannelMembers, streamChannelMembers]);
	const isCategoryExpanded = useSelector(selectCategoryExpandStateByCategoryId(channel.clan_id || '', channel.category_id || ''));
	const unreadMessageCount = useMemo(() => channel.count_mess_unread || 0, [channel.count_mess_unread]);

	const [openInviteModal, closeInviteModal] = useModal(() => <ModalInvite onClose={closeInviteModal} open={true} channelID={channel.id} />);

	const handleOpenInvite = () => {
		openInviteModal();
	};

	const listThreadRef = useRef<ListThreadChannelRef | null>(null);
	const channelLinkRef = useRef<ChannelLinkRef | null>(null);

	useImperativeHandle(ref, () => ({
		scrollIntoChannel: (options: ScrollIntoViewOptions = { block: 'center' }) => {
			channelLinkRef.current?.scrollIntoView(options);
		},
		scrollIntoThread: (threadId: string, options: ScrollIntoViewOptions = { block: 'center' }) => {
			listThreadRef.current?.scrollIntoThread(threadId, options);
		}
	}));

	const renderChannelLink = () => {
		return (
			<ChannelLink
				ref={channelLinkRef}
				clanId={channel?.clan_id}
				channel={channel}
				key={channel.id}
				createInviteLink={handleOpenInvite}
				isPrivate={channel.channel_private}
				isUnReadChannel={isUnreadChannel}
				numberNotification={unreadMessageCount}
				channelType={channel?.type}
				isActive={isActive}
				permissions={permissions}
			/>
		);
	};

	const renderChannelContent = () => {
		if (channel.type !== ChannelType.CHANNEL_TYPE_VOICE && channel.type !== ChannelType.CHANNEL_TYPE_STREAMING) {
			return (
				<>
					{renderChannelLink()}
					{channel.threads && <ThreadListChannel ref={listThreadRef} threads={channel.threads} isCollapsed={isCollapsed} />}
				</>
			);
		}

		if (isCategoryExpanded) {
			return (
				<>
					{renderChannelLink()}
					<UserListVoiceChannel channelID={channel.channel_id ?? ''} channelType={channel?.type} memberList={memberList} />
				</>
			);
		}

		return memberList.length > 0 ? (
			<>
				{renderChannelLink()}
				<Avatar.Group className="flex gap-3 justify-start items-center px-6">
					{[...memberList].slice(0, 5).map((member) => (
						<AvatarUser id={member.user_id} />
					))}
					{memberList && memberList.length > 5 && (
						<Avatar.Counter
							total={memberList?.length - 5 > 50 ? 50 : memberList?.length - 5}
							className="h-6 w-6 dark:text-bgLightPrimary text-bgPrimary ring-transparent dark:bg-bgTertiary bg-bgLightTertiary dark:hover:bg-bgTertiary hover:bg-bgLightTertiary"
						/>
					)}
				</Avatar.Group>
			</>
		) : null;
	};

	return <Fragment>{renderChannelContent()}</Fragment>;
});

export default memo(ChannelListItem);
