import { INotifiReactMessage, LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiNotifiReactMessage } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const NOTIFI_REACT_MESSAGE_FEATURE_KEY = 'notifireactmessage';

export interface NotifiReactMessageState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	notifiReactMessage?: INotifiReactMessage | null;
}

export const initialNotifiReactMessageState: NotifiReactMessageState = {
	loadingStatus: 'not loaded',
	notifiReactMessage: null,
};

export const getNotifiReactMessage = createAsyncThunk('notifireactmessage/getNotifiReactMessage', async (channelId: string, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.getNotificationReactMessage(mezon.session, channelId);
	if (!response) {
		return thunkAPI.rejectWithValue('Invalid session');
	}
	return response;
});

type SetNotifiReactMessagePayload = {
	channel_id?: string;
};

export const setNotifiReactMessage = createAsyncThunk(
	'notifireactmessage/setNotifiReactMessage',
	async ({ channel_id }: SetNotifiReactMessagePayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.setNotificationReactMessage(mezon.session, channel_id || '');
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(getNotifiReactMessage(channel_id || ''));
		return response;
	},
);

type DeleteNotifiReactMessagePayload = {
	channel_id?: string;
};

export const deleteNotifiReactMessage = createAsyncThunk(
	'notifireactmessage/deleteNotifiReactMessage',
	async ({ channel_id }: DeleteNotifiReactMessagePayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.deleteNotiReactMessage(mezon.session, channel_id || '');
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(getNotifiReactMessage(channel_id || ''));
		return response;
	},
);

export const notifiReactMessageSlice = createSlice({
	name: NOTIFI_REACT_MESSAGE_FEATURE_KEY,
	initialState: initialNotifiReactMessageState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotifiReactMessage.pending, (state: NotifiReactMessageState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(getNotifiReactMessage.fulfilled, (state: NotifiReactMessageState, action: PayloadAction<ApiNotifiReactMessage>) => {
				state.notifiReactMessage = action.payload;
				state.loadingStatus = 'loaded';
			})
			.addCase(getNotifiReactMessage.rejected, (state: NotifiReactMessageState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const notifiReactMessageReducer = notifiReactMessageSlice.reducer;

export const notifiReactMessageActions = {
	...notifiReactMessageSlice.actions,
	getNotifiReactMessage,
	setNotifiReactMessage,
	deleteNotifiReactMessage,
};

export const getNotifiReactMessageState = (rootState: { [NOTIFI_REACT_MESSAGE_FEATURE_KEY]: NotifiReactMessageState }): NotifiReactMessageState =>
	rootState[NOTIFI_REACT_MESSAGE_FEATURE_KEY];

export const selectNotifiReactMessage = createSelector(getNotifiReactMessageState, (state: NotifiReactMessageState) => state.notifiReactMessage);
