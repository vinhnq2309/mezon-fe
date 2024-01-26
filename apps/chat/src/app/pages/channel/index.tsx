import {
  ChannelList,
  ChannelTopbar,
  FooterProfile,
  ServerHeader,
  MemberList,
} from '@mezon/components';
import ChannelMessages from './ChanneMessages';
import { useChat } from '@mezon/core';
import { ChannelMessageBox } from './ChannelMessageBox';
import { LogOutButton } from 'libs/ui/src/lib/LogOutButton/index';
import Setting from "../setting"
import { useState } from 'react';
export default function Server() {
  const { currentChanel, currentClan, userProfile } = useChat();
  const [openSetting, setOpenSetting] = useState(false)
  if (!currentClan || !currentChanel) {
    return <div>Loading...</div>;
  }
  const handleOpenCreate = () => {
    setOpenSetting(true)
  }
  return (
    <>
      <div className="hidden flex-col w-[272px] bg-bgSurface md:flex">
        <ServerHeader
          name={currentClan?.clan_name}
          type="channel"
          bannerImage={currentClan.banner}
        />
        <ChannelList />
        <FooterProfile
          name={userProfile?.user?.username || ''}
          status={userProfile?.user?.online}
          avatar={userProfile?.user?.avatar_url || ''}
          openSetting={handleOpenCreate}
        />
      </div>
      <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%]">
        <ChannelTopbar channel={currentChanel} />
        <div className="flex h-screen">
          <div className="flex flex-col flex-1">
            <div className="overflow-y-auto bg-[#1E1E1E] h-[751px]">
              <ChannelMessages />
            </div>
            <div className="flex-shrink-0 bg-bgSecondary">
              <ChannelMessageBox />
            </div>
          </div>
          <div className="w-[268px] bg-bgSurface md:flex">
            <MemberList />
          </div>
        </div>
      </div>
      <Setting open={openSetting} onClose={() => {setOpenSetting(false)}}/>
    </>
  );
}
