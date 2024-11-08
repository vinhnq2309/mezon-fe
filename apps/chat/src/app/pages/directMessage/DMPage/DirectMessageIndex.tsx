import { DmTopbar } from '@mezon/components';
import { useAppNavigation, useAppParams } from '@mezon/core';
import { isLinuxDesktop, isWindowsDesktop } from '@mezon/utils';
import { useEffect } from 'react';
import ChannelMessages from '../../channel/ChannelMessages';

export default function DirectMessageIndex() {
	const { directId } = useAppParams();
	const { navigate } = useAppNavigation();

	useEffect(() => {
		if (!directId) {
			navigate(`../friends`);
		}
	}, [directId, navigate]);

	return (
		<div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%]">
			<DmTopbar.Skeleton />
			<div className="flex flex-row ">
				<div className="flex flex-col flex-1">
					<div
						className={`overflow-y-auto bg-bgSecondary ${isWindowsDesktop || isLinuxDesktop ? 'max-h-heightTitleBarMessageViewChat h-heightTitleBarMessageViewChat' : 'max-h-heightMessageViewChat h-heightMessageViewChat'}`}
					>
						<ChannelMessages.Skeleton />
					</div>
				</div>
			</div>
		</div>
	);
}
