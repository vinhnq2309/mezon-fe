import { ShortUserProfile } from '@mezon/components';
import { useOnClickOutside } from '@mezon/core';
import { IMessageWithUser, MouseButton } from '@mezon/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMessageParser } from './useMessageParser';
import useShowName from './useShowName';

const NX_CHAT_APP_ANNONYMOUS_USER_ID = process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID || 'anonymous';

type IMessageHeadProps = {
	message: IMessageWithUser;
	isCombine: boolean;
	isShowFull?: boolean;
	mode?: number;
};

const MessageHead = ({ message, isCombine, isShowFull, mode }: IMessageHeadProps) => {
	const { messageTime } = useMessageParser(message);

	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const panelRefShort = useRef<HTMLDivElement>(null);
	const [positionLeft, setPositionLeft] = useState(0);
	const [positionTop, setPositionTop] = useState(0);
	const [positionBottom, setPositionBottom] = useState(false);

	const { userClanNickname, userDisplayName, username, senderId } = useMessageParser(message);

	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.button === MouseButton.LEFT) {
			setIsShowPanelChannel(true);
			const clickY = event.clientY;
			const windowHeight = window.innerHeight;
			const distanceToBottom = windowHeight - clickY;
			const elementName = event.currentTarget;
			if (elementName) {
				setPositionLeft(elementName.getBoundingClientRect().width + 420);
				setPositionTop(clickY - 50);
				setPositionBottom(false);
			}
			const heightElementShortUserProfileMin = 313;
			if (distanceToBottom < heightElementShortUserProfileMin) {
				setPositionBottom(true);
			}
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	const handleDefault = (e: any) => {
		e.stopPropagation();
	};

	useEffect(() => {
		const updatePosition = () => {
			const width = window.innerWidth;
			if (panelRefShort.current) {
				if (width >= 910) {
					panelRefShort.current.style.left = `${positionLeft}px`;
				} else if (width >= 480 && width < 910) {
					panelRefShort.current.style.left = `42px`;
				} else {
					panelRefShort.current.style.left = `20px`;
				}
			}
		};

		updatePosition();
		window.addEventListener('resize', updatePosition);

		return () => {
			window.removeEventListener('resize', updatePosition);
		};
	}, [positionLeft]);

	const checkAnonymous = useMemo(() => senderId === NX_CHAT_APP_ANNONYMOUS_USER_ID, [senderId]);

	const nameShowed = useShowName(userClanNickname ?? '', userDisplayName ?? '', username ?? '', senderId ?? '');

	if (isCombine && message.references?.length === 0 && !isShowFull) {
		return <></>;
	}

	return (
		<div className="relative group">
			<div className="flex-row items-center w-full gap-4 flex">
				<div
					className="text-base text-textLightUserName font-medium tracking-normal cursor-pointer break-all username"
					ref={panelRef}
					onMouseDown={(event) => handleMouseClick(event)}
					role="button"
					style={{ letterSpacing: '-0.01rem' }}
				>
					{nameShowed}
				</div>
				<div className=" dark:text-zinc-400 text-colorTextLightMode text-[10px] cursor-default">{messageTime}</div>
			</div>
			{isShowPanelChannel && (
				<div
					className={`dark:bg-black bg-gray-200 mt-[10px] w-[300px] max-w-[89vw] rounded-lg flex flex-col z-10 opacity-100 fixed `}
					style={{
						left: `20px`,
						top: positionBottom ? '' : `${positionTop}px`,
						bottom: positionBottom ? '64px' : '',
					}}
					onMouseDown={handleDefault}
					role="button"
					ref={panelRefShort}
				>
					<ShortUserProfile userID={senderId} message={message} mode={mode} />
				</div>
			)}
		</div>
	);
};

export default MessageHead;
