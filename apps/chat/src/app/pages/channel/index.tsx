
import { ChannelList, ChannelTopbar, FooterProfile, ServerHeader } from '@mezon/components'
import ChannelMessages from './ChanneMessages'
import { useChat } from '@mezon/core'
import { ChannelMessageBox } from './ChannelMessageBox'
// import { LogOutButton } from 'libs/ui/src/lib/LogOutButton/index';


export default function Server() {
    const { currentChanel, currentClan } = useChat()

    if (!currentClan || !currentChanel) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="hidden flex-col w-60 bg-bgSurface md:flex">
                <ServerHeader name={currentClan?.name} type='channel' />
                <ChannelList />
                <FooterProfile name='nhan.nguyen' status='Online' />
                {/* <LogOutButton /> */}
            </div>
            <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary">
                <ChannelTopbar channel={currentChanel} />
                <div className="overflow-y-scroll flex-1">
                    <ChannelMessages />
                </div>
                <div className="flex-shrink-0 bg-bgSecondary">
                    <ChannelMessageBox />
                </div>
            </div>
        </>
    )
}
