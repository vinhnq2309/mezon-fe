import { directActions, emojiSuggestionActions, friendsActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const directLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(emojiSuggestionActions.fetchEmoji({ clanId: '0', noCache: true }));
	dispatch(friendsActions.fetchListFriends({}));
	dispatch(directActions.fetchDirectMessage({}));
	return null;
};
