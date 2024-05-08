import { RootState } from '@mezon/store';
import { Loading } from 'libs/ui/src/lib/Loading/index';
import { useSelector } from 'react-redux';

interface CreateChannelProps {
	onClickCancel: () => void;
	onClickCreate: () => void;
}

export const CreateChannelButton: React.FC<CreateChannelProps> = ({ onClickCancel, onClickCreate }) => {
	const isLoading = useSelector((state: RootState) => state.channels.loadingStatus);
	return (
		<div className="Frame394 relative border-t border-solid border-borderDefault self-stretch mb-0 pt-3 justify-end items-center gap-4 inline-flex">
			<button onClick={onClickCancel} className="Text text-white hover:underline text-xs leading-normal font-semibold">
				Cancel
			</button>

			<button
				disabled={isLoading !== 'loaded' ? true : false}
				onClick={onClickCreate}
				className="Text text-white disabled:cursor-not-allowed text-xs leading-normal relative h-10 w-30 justify-center px-3 py-3 bg-blue-600 hover:bg-blue-500 flex flex-row items-center gap-1 font-semibold rounded"
			>
				{isLoading !== 'loaded' && <Loading />}
				{isLoading !== 'loaded' ? <span>Creating</span> : <span>Create Channel</span>}
			</button>
		</div>
	);
};
