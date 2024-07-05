import { SHOW_POSITION } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ShowContextMenuParams, useContextMenu } from 'react-contexify';
import MessageContextMenu from './MessageContextMenu';

const MESSAGE_CONTEXT_MENU_ID = 'message-context-menu';

type MessageContextMenuContextValue = {
	messageId: string;
	showMessageContextMenu: (
		event: React.MouseEvent<HTMLElement>,
		messageId: string,
		mode: ChannelStreamMode,
		props?: Partial<MessageContextMenuProps>,
	) => void;
	preloadMessageContextMenu: (messageId: string) => void;
	setPositionShow: (showPostion: SHOW_POSITION) => void;
	posShowMenu: string;
};

export type MessageContextMenuProps = {
	messageId: string;
	position?: ShowContextMenuParams['position'];
};

export const MessageContextMenuContext = createContext<MessageContextMenuContextValue>({
	messageId: '',
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	showMessageContextMenu: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	preloadMessageContextMenu: () => {},
	setPositionShow: () => {},
	posShowMenu: SHOW_POSITION.NONE,
});

export const MessageContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
	const [messageId, setMessageId] = useState('');
	const [elementTarget, setElementTarget] = useState<HTMLElement | null>(null);
	const [activeMode, setActiveMode] = useState<ChannelStreamMode>(ChannelStreamMode.STREAM_MODE_CHANNEL);
	const [posShowMenu, setPosShowMenu] = useState<string>(SHOW_POSITION.NONE);

	const { show } = useContextMenu({
		id: MESSAGE_CONTEXT_MENU_ID,
	});

	const menu = useMemo(() => {
		if (!messageId) return null;

		return <MessageContextMenu id={MESSAGE_CONTEXT_MENU_ID} messageId={messageId} elementTarget={elementTarget} activeMode={activeMode} />;
	}, [messageId, elementTarget, activeMode]);

	const preloadMessageContextMenu = useCallback((messageId: string) => {
		setMessageId(messageId);
	}, []);

	const setPositionShow = useCallback((pos: string) => {
		setPosShowMenu(pos);
	}, []);

	const showContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, props: MessageContextMenuProps) => {
			const position = props.position || null;
			show({
				event,
				props,
				position,
			});
		},
		[show],
	);

	const showMessageContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, messageId: string, mode: ChannelStreamMode, props?: Partial<MessageContextMenuProps>) => {
			setMessageId(messageId);
			setElementTarget(event.target as HTMLElement);
			setActiveMode(mode);
			const niceProps = {
				messageId,
				...props,
			};
			showContextMenu(event, niceProps);
		},
		[showContextMenu],
	);

	const value = useMemo(
		() => ({
			messageId,
			showMessageContextMenu,
			preloadMessageContextMenu,
			setPositionShow,
			posShowMenu,
		}),
		[showMessageContextMenu, preloadMessageContextMenu, messageId, setPositionShow, posShowMenu],
	);

	return (
		<MessageContextMenuContext.Provider value={value}>
			{children}
			{menu}
		</MessageContextMenuContext.Provider>
	);
};

export const useMessageContextMenu = () => useContext(MessageContextMenuContext);
