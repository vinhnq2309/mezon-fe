import { clansActions, emojiActions, getStoreAsync } from '@mezon/store';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

export type ClanLoaderData = {
	clanId: string;
};

export const clanLoader: LoaderFunction = async ({ params }) => {
	const { clanId } = params;
	const store = await getStoreAsync();
	if (!clanId) {
		throw new Error('Server ID null');
	}
	store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
	store.dispatch(emojiActions.fetchEmoji())
	return {
		clanId,
	} as ClanLoaderData;
};



export const shouldRevalidateServer: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { clanId: currentServerId } = currentParams;
	const { clanId: nextServerId } = nextParams;
	return currentServerId !== nextServerId;
};
