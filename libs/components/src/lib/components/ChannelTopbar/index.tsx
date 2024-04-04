import { useOnClickOutside } from '@mezon/core';
import { appActions, selectIsShowMemberList } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Icons from '../Icons';
import NotificationList from '../NotificationList';
import { ChannelLabel, SearchMessage } from './TopBarComponents';
import ThreadModal from './TopBarComponents/Threads/ThreadModal';

export type ChannelTopbarProps = {
	channel?: IChannel | null;
};

function ChannelTopbar({ channel }: ChannelTopbarProps) {
	return (
		<div className="flex p-3 min-w-0 items-center bg-bgSecondary border-b border-black flex-shrink h-heightHeader">
			<div className="justify-start items-center gap-1 flex">
				<ChannelLabel />
			</div>

			{/* Desktop buttons */}
			<div className=" items-center h-full ml-auto flex">
				<div className="justify-end items-center gap-2 flex">
					<div className="hidden ssm:flex">
						<div className="relative justify-start items-center gap-[15px] flex iconHover">
							<ThreadButton />
							<MuteButton />
							<PinButton />
							<ChannelListButton />
							<ThreeDotButton />
						</div>
						<SearchMessage />

						<div
							className="gap-4 iconHover relative flex items-center  w-[82px] h-8 justify-center  bg-[linear-gradient(90deg,_#151515de,_#151515,_#151515)] left-[345px] ssm:left-auto ssm:right-0"
							id="inBox"
						>
							<InboxButton />
							<HelpButton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ThreadButton() {
	const [isShowThread, setIsShowThread] = useState<boolean>(false);
	const threadRef = useRef<HTMLDivElement | null>(null);

	const handleShowThreads = () => {
		setIsShowThread(!isShowThread);
	};

	useOnClickOutside(threadRef, () => setIsShowThread(false));

	return (
		<div className="relative leading-5" ref={threadRef}>
			<Tooltip className={`${isShowThread && 'hidden'}`} content="Threads" trigger="hover" animation="duration-500">
				<button onClick={handleShowThreads} onContextMenu={(e) => e.preventDefault()}>
					<Icons.ThreadIcon />
				</button>
			</Tooltip>
			{isShowThread && <ThreadModal setIsShowThread={setIsShowThread} />}
		</div>
	);
}

function MuteButton() {
	return (
		<button>
			<Icons.MuteBell />
		</button>
	);
}

function PinButton() {
	return (
		<button>
			<Icons.PinRight />
		</button>
	);
}

function ThreeDotButton() {
	return (
		<button>
			<Icons.ThreeDot />
		</button>
	);
}

function InboxButton() {
	const [isShowInbox, setIsShowInbox] = useState<boolean>(false);
	const inboxRef = useRef<HTMLDivElement | null>(null);

	const handleShowInbox = () => {
		setIsShowInbox(!isShowInbox);
	};

	useOnClickOutside(inboxRef, () => setIsShowInbox(false));
	return (
		<div className="relative leading-5" ref={inboxRef}>
			<button onClick={handleShowInbox} onContextMenu={(e) => e.preventDefault()}>
				<Icons.Inbox />
			</button>
			{isShowInbox && <NotificationList />}
		</div>
	);
}

function HelpButton() {
	return (
		<button>
			<Icons.Help />
		</button>
	);
}

function ChannelListButton() {
	const dispatch = useDispatch();
	const isActive = useSelector(selectIsShowMemberList);
	const handleClick = () => {
		dispatch(appActions.setIsShowMemberList(!isActive));
	};
	return (
		<button onClick={handleClick}>
			<Icons.MemberList isWhite={isActive} />
		</button>
	);
}

export default ChannelTopbar;
