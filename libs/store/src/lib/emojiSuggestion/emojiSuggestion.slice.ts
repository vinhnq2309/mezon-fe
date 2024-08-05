import { IEmoji } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiClanEmojiCreateRequest, ApiClanEmojiListResponse, MezonUpdateClanEmojiByIdBody } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';
const LIST_EMOJI_CACHED_TIME = 1000 * 60 * 3;
export const EMOJI_SUGGESTION_FEATURE_KEY = 'suggestionEmoji';

export interface EmojiSuggestionEntity extends IEmoji {
	id: string;
}

export interface EmojiSuggestionState extends EntityState<EmojiSuggestionEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	emojiPicked: string;
	emojiSuggestionListStatus: boolean;
	keyCodeFromKeyBoardState: number;
	textToSearchEmojiSuggestion: string;
	addEmojiAction: boolean;
	shiftPressed: boolean;
}

type UpdateEmojiRequest = {
	request: MezonUpdateClanEmojiByIdBody;
	emojiId: string;
};

export const emojiSuggestionAdapter = createEntityAdapter({
	selectId: (emo: EmojiSuggestionEntity) => emo.id || '',
});

type FetchEmojiArgs = {
	clanId: string;
	noCache?: boolean;
};

const fetchEmojiCached = memoizee((mezon: MezonValueContext, clanId: string) => mezon.client.listClanEmoji(mezon.session, clanId), {
	promise: true,
	maxAge: LIST_EMOJI_CACHED_TIME,
	normalizer: (args) => {
		return args[0]!.session!.username!;
	},
});

export const fetchEmoji = createAsyncThunk('emoji/fetchEmoji', async ({ clanId, noCache }: FetchEmojiArgs, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	if (noCache) {
		fetchEmojiCached.clear(mezon, clanId);
	}
	const response = await fetchEmojiCached(mezon, clanId);
	if (!response.emoji_list) {
		throw new Error('Emoji list is undefined or null');
	}
	return response.emoji_list;
});
export const createEmojiSetting = createAsyncThunk(
	'settingClanEmoji/createEmoji',
	async (form: { request: ApiClanEmojiCreateRequest; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const res = await mezon.client.createClanEmoji(mezon.session, form.request);
			if (!res) {
				return thunkAPI.rejectWithValue({});
			}
			thunkAPI.dispatch(fetchEmoji({ clanId: form.clanId, noCache: true }));
		} catch (error) {
			return thunkAPI.rejectWithValue({});
		}
	},
);
export const updateEmojiSetting = createAsyncThunk('settingClanEmoji/updateEmoji', async ({ request, emojiId }: UpdateEmojiRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.updateClanEmojiById(mezon.session, emojiId, request);
		if (res) {
			return { request, emojiId };
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
	}
});
export const deleteEmojiSetting = createAsyncThunk('settingClanEmoji/deleteEmoji', async (emoji: ApiClanEmojiListResponse, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.deleteByIdClanEmoji(mezon.session, emoji.id || '');
		if (res) {
			return emoji;
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
	}
});
export const initialEmojiSuggestionState: EmojiSuggestionState = emojiSuggestionAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	emojiPicked: '',
	emojiSuggestionListStatus: false,
	keyCodeFromKeyBoardState: 1000,
	textToSearchEmojiSuggestion: '',
	addEmojiAction: false,
	shiftPressed: false,
});

export const emojiSuggestionSlice = createSlice({
	name: EMOJI_SUGGESTION_FEATURE_KEY,
	initialState: initialEmojiSuggestionState,
	reducers: {
		add: emojiSuggestionAdapter.addOne,
		remove: emojiSuggestionAdapter.removeOne,

		setSuggestionEmojiPicked: (state, action: PayloadAction<string>) => {
			state.emojiPicked = action.payload;
		},

		setStatusSuggestionEmojiList: (state, action: PayloadAction<boolean>) => {
			state.emojiSuggestionListStatus = action.payload;
		},
		setTextToSearchEmojiSuggestion: (state, action: PayloadAction<string>) => {
			state.textToSearchEmojiSuggestion = action.payload;
		},
		setAddEmojiActionChatbox: (state, action: PayloadAction<boolean>) => {
			state.addEmojiAction = action.payload;
		},
		setShiftPressed: (state, action: PayloadAction<boolean>) => {
			state.shiftPressed = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEmoji.pending, (state: EmojiSuggestionState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEmoji.fulfilled, (state, action: PayloadAction<any[]>) => {
				emojiSuggestionAdapter.setAll(state, action.payload);

				state.loadingStatus = 'loaded';
			})
			.addCase(fetchEmoji.rejected, (state: EmojiSuggestionState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder.addCase(updateEmojiSetting.fulfilled, (state, action) => {
			const dataChange = action.payload?.request;
			emojiSuggestionAdapter.updateOne(state, {
				id: action.payload?.emojiId ?? '',
				changes: {
					shortname: dataChange?.shortname,
				},
			});
		});
		builder.addCase(deleteEmojiSetting.fulfilled, (state, action) => {
			emojiSuggestionAdapter.removeOne(state, action.payload?.id ?? '');
		});
	},
});

export const emojiSuggestionReducer = emojiSuggestionSlice.reducer;

export const emojiSuggestionActions = {
	...emojiSuggestionSlice.actions,
	fetchEmoji,
	updateEmojiSetting,
	deleteEmojiSetting,
	createEmojiSetting,
};

const { selectAll, selectEntities } = emojiSuggestionAdapter.getSelectors();

export const getEmojiSuggestionState = (rootState: { [EMOJI_SUGGESTION_FEATURE_KEY]: EmojiSuggestionState }): EmojiSuggestionState =>
	rootState[EMOJI_SUGGESTION_FEATURE_KEY];

export const selectAllEmojiSuggestion = createSelector(getEmojiSuggestionState, selectAll);

export const selectEmojiSuggestionEntities = createSelector(getEmojiSuggestionState, selectEntities);

export const selectEmojiSuggestion = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.emojiPicked);

export const selectEmojiListStatus = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.emojiSuggestionListStatus);

export const selectTextToSearchEmojiSuggestion = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.textToSearchEmojiSuggestion);

export const selectAddEmojiState = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.addEmojiAction);

export const selectShiftPressedStatus = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.shiftPressed);
