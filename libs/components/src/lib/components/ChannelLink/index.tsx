import { Link } from 'react-router-dom';
import { ChannelStatusEnum, ChannelTypeEnum, IChannel } from '@mezon/utils';
import { AddPerson, Hashtag, Speaker } from '../Icons';
import { useAppNavigation } from '@mezon/core';
import * as Icons from '../Icons';
export type ChannelLinkProps = {
    serverId?: string;
    channel: IChannel;
    active?: boolean;
    createInviteLink: (serverId: string, channelId: string) => void;
    isPrivate?: number;
};

function ChannelLink({
    serverId,
    channel,
    active,
    isPrivate,
    createInviteLink,
}: ChannelLinkProps) {
    const state = active
        ? 'active'
        : channel?.unread
          ? 'inactiveUnread'
          : 'inactiveRead';

    const classes = {
        active: 'flex flex-row items-center px-2 mx-2 rounded relative p-1',
        inactiveUnread:
            'flex flex-row items-center px-2 mx-2 rounded relative p-1 hover:bg-[#36373D]',
        inactiveRead:
            'flex flex-row items-center px-2 mx-2 rounded relative p-1 hover:bg-[#36373D]',
    };

    const { toChannelPage } = useAppNavigation();

    const handleCreateLinkInvite = () => {
        createInviteLink(serverId || '', channel.channel_id || '');
    };

    const channelPath = toChannelPage(channel.id, channel?.clan_id || '');

    return (
        <div className="relative group">
            <Link to={channelPath}>
                <span
                    className={`${classes[state]} ${active ? 'bg-[#36373D]' : ''}`}
                >
                    {state === 'inactiveUnread' && (
                        <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>
                    )}
                    <div className="relative mt-[-5px]">
                        {isPrivate === ChannelStatusEnum.isPrivate &&
                            channel.type === ChannelTypeEnum.CHANNEL_VOICE && (
                                <Icons.SpeakerLocked defaultSize="w-5 h-5" />
                            )}
                        {isPrivate === ChannelStatusEnum.isPrivate &&
                            channel.type === ChannelTypeEnum.CHANNEL_TEXT && (
                                <Icons.HashtagLocked defaultSize="w-5 h-5 " />
                            )}
                        {isPrivate === undefined &&
                            channel.type === ChannelTypeEnum.CHANNEL_VOICE && (
                                <Icons.Speaker defaultSize="w-5 5-5" />
                            )}
                        {isPrivate === undefined &&
                            channel.type === ChannelTypeEnum.CHANNEL_TEXT && (
                                <Icons.Hashtag defaultSize="w-5 h-5" />
                            )}
                    </div>
                    <p
                        className={`ml-2 text-[#AEAEAE] w-full group-hover:text-white text-[15px] focus:bg-[#36373D] ${active ? 'text-white' : ''}`}
                        title={
                            channel.channel_lable &&
                            channel?.channel_lable.length > 20
                                ? channel?.channel_lable
                                : undefined
                        }
                    >
                        {channel.channel_lable &&
                        channel?.channel_lable.length > 20
                            ? `${channel?.channel_lable.substring(0, 20)}...`
                            : channel?.channel_lable}
                    </p>
                </span>
            </Link>
            <AddPerson
                className={`absolute ml-auto w-4 h-4  top-[6px] right-3 group-hover:text-white  ${active ? 'text-white' : 'text-[#0B0B0B]'} cursor-pointer`}
                onClick={handleCreateLinkInvite}
            />
        </div>
    );
}

export default ChannelLink;
