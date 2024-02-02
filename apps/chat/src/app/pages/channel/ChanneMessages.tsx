import { IMessageWithUser } from "@mezon/utils";
import { ChannelMessage } from "./ChannelMessage";
import { useChatChannel } from "@mezon/core";
import { useEffect, useRef } from "react";
import { checkMessageSendingAction } from "@mezon/store";
import { useDispatch } from "react-redux";

type ChannelMessagesProps = {
    channelId: string;
};

export default function ChannelMessages({ channelId }: ChannelMessagesProps) {
    const { messages, unreadMessageId, lastMessageId } = useChatChannel(channelId);
    return (
        <>
            {messages.map((message, i) => (
                <ChannelMessage key={message.id} lastSeen={message.id === unreadMessageId && message.id !== lastMessageId} message={message} />
            ))}
        </>
    );
}

ChannelMessages.Skeleton = () => {
    return (
        <>
            <ChannelMessage.Skeleton />
            <ChannelMessage.Skeleton />
            <ChannelMessage.Skeleton />
        </>
    );
};
