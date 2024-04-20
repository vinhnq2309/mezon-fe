import { useChatSending, useGifs } from '@mezon/core';
import { IMessageSendPayload, SubPanelName } from '@mezon/utils';
import { Loading } from 'libs/ui/src/lib/Loading';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useState } from 'react';

type ChannelMessageBoxProps = {
	activeTab: SubPanelName;
	channelId: string;
	channelLabel: string;
	controlEmoji?: boolean;
	clanId?: string;
	mode: number;
};

function TenorGifCategories({ activeTab, channelId, channelLabel, mode }: ChannelMessageBoxProps) {
	const [data, setData] = useState<any>();
	const [isError, setIsError] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const { sendMessage } = useChatSending({ channelId, channelLabel, mode });
	const { dataGifs, dataGifsSearch, loadingStatusGifs, setValueInputSearch, valueInputToCheckHandleSearch } = useGifs();
	const [currentItems, setCurrentItems] = useState<any>();

	useEffect(() => {
		if (data) {
			setCurrentItems(data.slice(indexOfFirstItem, indexOfLastItem));
		}
	}, [data]);

	useEffect(() => {
		if (dataGifsSearch && valueInputToCheckHandleSearch !== '') {
			setData(dataGifsSearch);
		} else if (valueInputToCheckHandleSearch === '') {
			setData(dataGifs);
		}
	}, [dataGifs, dataGifsSearch, valueInputToCheckHandleSearch]);

	console.log(dataGifs);
	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
		) => {
			sendMessage(content, mentions, attachments, references);
		},
		[sendMessage],
	);

	const handleClickGif = (giftUrl: string) => {
		handleSend({ t: '' }, [], [{ url: giftUrl }], []);
	};

	const renderGifs = () => {
		if (loadingStatusGifs === 'loading') {
			return <Loading />;
		}
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
				{currentItems &&
					currentItems.map((gif: any, index: number) => (
						<div
							key={gif.id}
							className={`order-${index} overflow-hidden cursor-pointer`}
							onClick={() => handleClickGif(gif.images.original.url)}
						>
							<img src={gif.images.fixed_height.url} className="w-full h-auto" />
						</div>
					))}
			</div>
		);
	};

	const renderError = () => {
		if (isError) {
			return (
				<div className="alert alert-danger alert-dismissible fade show" role="alert">
					Unable to get Gifs, please try again in a few minutes
				</div>
			);
		}
	};

	return (
		<>
			{renderError()}
			<div className="mx-2 flex justify-center h-[400px] overflow-y-scroll hide-scrollbar flex-wrap">{renderGifs()}</div>
		</>
	);
}

export default TenorGifCategories;
