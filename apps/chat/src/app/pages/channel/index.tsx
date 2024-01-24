import {
  ChannelList,
  ChannelTopbar,
  FooterProfile,
  ServerHeader,
} from '@mezon/components';
import ChannelMessages from './ChanneMessages';
import { useChat } from '@mezon/core';
import { ChannelMessageBox } from './ChannelMessageBox';

export default function Server() {
  const { currentChanel, currentClan } = useChat();

  if (!currentClan || !currentChanel) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-full w-full">
      <div className="hidden flex-col w-[272px] bg-bgSurface md:flex">
        <ServerHeader
          name={currentClan?.clan_name}
          type="channel"
          bannerImage={currentClan.banner}
        />
        <ChannelList />
        <FooterProfile name="nhan.nguyen" status="Online" />
      </div>
      <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary">
        <ChannelTopbar channel={currentChanel} />
        <div className="flex-1 overflow-y-auto">
          <ChannelMessages />
        </div>
        <div className="flex-shrink-0 bg-bgSecondary">
          <ChannelMessageBox />
        </div>
      </div>
    </div>
  );
}
