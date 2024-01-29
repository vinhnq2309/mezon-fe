import { Link } from 'react-router-dom';
import { ChannelTypeEnum, IChannel } from '@mezon/utils';
import { AddPerson, Hashtag, Speaker } from '../Icons';
import { useAppNavigation } from '@mezon/core';

export type ChannelLinkProps = {
  serverId?: string;
  channel: IChannel;
  active?: boolean;
  createInviteLink: (serverId: string, channelId: string) => void;
};

function ChannelLink({
  serverId,
  channel,
  active,
  createInviteLink,
}: ChannelLinkProps) {
  const state = active
    ? 'active'
    : channel?.unread
      ? 'inactiveUnread'
      : 'inactiveRead';

  const classes = {
    active: 'text-white bg-gray-550/[0.32]',
    inactiveUnread:
      'text-white hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]',
    inactiveRead:
      'text-gray-300 hover:text-gray-100 hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]',
  };

  const { toChannelPage } = useAppNavigation()

  const handleCreateLinkInvite = () => {
    createInviteLink(serverId || '', channel.channel_id || '')
  }

  const channelPath = toChannelPage(channel.id, channel?.clan_id || '')

  return (
    <div className='relative group'>
      <Link to={channelPath}>
        <span
          className={`${classes[state]} hover:bg-[#36373D] flex flex-row items-center px-2 mx-2 rounded relative p-1 focus:bg-[#36373D]`}
        >
          {state === 'inactiveUnread' && (
            <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>
          )}
          {channel.type === ChannelTypeEnum.CHANNEL_TEXT ? (
            <Hashtag />
          ) : (
            <Speaker />
          )}
          <p className="ml-2 text-[#AEAEAE] w-full hover:text-white text-sm focus:bg-[#36373D]">
            {channel?.channel_lable}
          </p>
        </span>
      </Link>
      <AddPerson
        className="absolute ml-auto w-4 h-4 text-gray-200 top-[6px] right-3 hover:text-gray-100 opacity-0 group-hover:opacity-100"
        onClick={handleCreateLinkInvite}
      />
    </div>
  );
}

export default ChannelLink;
