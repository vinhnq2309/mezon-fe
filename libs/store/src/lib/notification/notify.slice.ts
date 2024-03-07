import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import {  ChannelMessage, Notification } from 'vendors/mezon-js/packages/mezon-js/dist';
import { ensureSession, getMezonCtx } from '../helpers';
export const NOTIFICATION_FEATURE_KEY = 'notification';

export interface NotificationEntity extends Notification {
	id: string;
}

export interface INotification extends Notification {
	id: string;
	contentNotify?: any;
}

export const mapNotificationToEntity = (notifyRes: Notification): INotification => {
	return { ...notifyRes, id: notifyRes.id || '', contentNotify: notifyRes.content };
};

export interface NotificationState extends EntityState<NotificationEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	notificationMentions: ChannelMessage[]
}

export const notificationAdapter = createEntityAdapter<NotificationEntity>();

export const fetchListNotification = createAsyncThunk('notification/fetchListNotification', async (_, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.listNotifications(mezon.session,50);
	if (!response.notifications) {
		return thunkAPI.rejectWithValue([]);
	}
	return response.notifications.map(mapNotificationToEntity);

});

export const fetchNotifyMention = createAsyncThunk('notification/notifyMention', async (_, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.listMessageMentions(mezon.session, 50, true);
	if (!response.messages) {
		return thunkAPI.rejectWithValue([]);
	}
	
	return response.messages
});


export const deleteNotify = createAsyncThunk('notification/deleteNotify', async (ids:string[], thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	console.log('ID Notification: ', ids)
	const response = await mezon.client.deleteNotifications(mezon.session,ids);
	if (!response) {
		return thunkAPI.rejectWithValue([]);
	}
	thunkAPI.dispatch(notificationActions.fetchListNotification());
	return response;
});


export const initialNotificationState: NotificationState = notificationAdapter.getInitialState({
	loadingStatus: 'not loaded',
	notificationMentions: [],
	error: null,
});

export const notificationSlice = createSlice({
	name: NOTIFICATION_FEATURE_KEY,
	initialState: initialNotificationState,
	reducers: {
		add: notificationAdapter.addOne,
		remove: notificationAdapter.removeOne,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchListNotification.pending, (state: NotificationState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchListNotification.fulfilled, (state: NotificationState, action: PayloadAction<INotification[]>) => {
				notificationAdapter.setMany(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchListNotification.rejected, (state: NotificationState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
			builder
			.addCase(fetchNotifyMention.pending, (state: NotificationState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchNotifyMention.fulfilled, (state: NotificationState, action: PayloadAction<ChannelMessage[]>) => {
				state.notificationMentions = action.payload;
			})
			.addCase(fetchNotifyMention.rejected, (state: NotificationState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = {
	...notificationSlice.actions,
	fetchListNotification,
	deleteNotify,
	fetchNotifyMention
};

const { selectAll } = notificationAdapter.getSelectors();

export const getNotificationState = (rootState: { [NOTIFICATION_FEATURE_KEY]:NotificationState }): NotificationState => rootState[NOTIFICATION_FEATURE_KEY];
export const selectAllNotification = createSelector(getNotificationState, selectAll);
