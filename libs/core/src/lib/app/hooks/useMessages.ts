import { IMessageWithUser } from '@mezon/utils';
import { useEffect, useState } from 'react';

type MessageProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  channelId: string;
  hasMoreMessage: boolean;
  loadMoreMessage: () => void;
  messages: IMessageWithUser[];
};

export const useMessages = ({ chatRef, channelId, hasMoreMessage, loadMoreMessage, messages }: MessageProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(channelId);

  useEffect(() => {
    const currentChatRef = chatRef.current;
    if (!currentChatRef || isFetching) return;

    if (channelId !== currentChannelId) {
      currentChatRef.scrollTop = currentChatRef.scrollHeight;
      setCurrentChannelId(channelId);
    }
  }, [channelId, currentChannelId, isFetching, chatRef]);

  useEffect(() => {
    const currentChatRef = chatRef.current;
    if (!currentChatRef || isFetching) return;

    if (messages.length <= 50) {
      currentChatRef.scrollTop = currentChatRef.scrollHeight;
    }
  }, [messages.length, chatRef, isFetching]);

  useEffect(() => {
    const handleWheel = async (event: WheelEvent) => {
      const currentChatRef = chatRef.current;
      if (!currentChatRef || isFetching) return;

      if (currentChatRef.scrollTop === 0 && hasMoreMessage) {
        const previousHeight = currentChatRef.scrollHeight;
        setIsFetching(true);
        await loadMoreMessage();
        setIsFetching(false);
        currentChatRef.scrollTop = currentChatRef.scrollHeight - previousHeight;
      }
    };

    const currentChatRef = chatRef.current;
    currentChatRef?.addEventListener('wheel', handleWheel, {passive: true});
    return () => {
      currentChatRef?.removeEventListener('wheel', handleWheel);
    };
  }, [hasMoreMessage, loadMoreMessage, chatRef, isFetching]);

  return isFetching;
};
