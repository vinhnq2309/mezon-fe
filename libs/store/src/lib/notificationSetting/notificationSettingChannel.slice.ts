import { INotificationSetting, LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiNotificationUserChannel } from 'mezon-js/api.gen';
import { ensureSession, ensureSocket, getMezonCtx } from '../helpers';
import { defaultNotificationCategoryActions } from './notificationSettingCategory.slice';

export const NOTIFICATION_SETTING_FEATURE_KEY = 'notificationsetting';

export interface NotificationSettingState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	currentChannelNotificationSetting?: INotificationSetting | null;
	selectedChannelNotificationSetting?: INotificationSetting | null;
}

export const initialNotificationSettingState: NotificationSettingState = {
	loadingStatus: 'not loaded',
	currentChannelNotificationSetting: null
};

type FetchNotificationSettingsArgs = {
	channelId: string;
	isCurrentChannel?: boolean;
};

type GetNotificationSettingResponse = {
	notificationSetting: ApiNotificationUserChannel;
	isCurrentChannel: boolean | undefined;
};

export const getNotificationSetting = createAsyncThunk(
	'notificationsetting/getNotificationSetting',
	async ({ channelId, isCurrentChannel = true }: FetchNotificationSettingsArgs, thunkAPI) => {
		const mezon = await ensureSocket(getMezonCtx(thunkAPI));
		const response = await mezon.socketRef.current?.getNotificationChannelSetting(channelId);
		if (!response) {
			return thunkAPI.rejectWithValue('Invalid session');
		}
		const apiNotificationUserChannel: ApiNotificationUserChannel = {
			active: response.notification_user_channel?.active,
			id: response.notification_user_channel?.id,
			notification_setting_type: response.notification_user_channel?.notification_setting_type,
			time_mute: response.notification_user_channel?.time_mute
		};
		const payload: GetNotificationSettingResponse = {
			notificationSetting: apiNotificationUserChannel,
			isCurrentChannel: isCurrentChannel
		};
		return payload;
	}
);

export type SetNotificationPayload = {
	channel_id?: string;
	notification_type?: number;
	time_mute?: string;
	clan_id: string;
	is_current_channel?: boolean;
};

export const setNotificationSetting = createAsyncThunk(
	'notificationsetting/setNotificationSetting',
	async ({ channel_id, notification_type, time_mute, clan_id, is_current_channel = true }: SetNotificationPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const body = {
			channel_category_id: channel_id,
			notification_type: notification_type,
			time_mute: time_mute
		};
		const response = await mezon.client.setNotificationChannel(mezon.session, body);
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(defaultNotificationCategoryActions.fetchChannelCategorySetting({ clanId: clan_id || '' }));
		thunkAPI.dispatch(getNotificationSetting({ channelId: channel_id || '', isCurrentChannel: is_current_channel }));
		return response;
	}
);

export type SetMuteNotificationPayload = {
	channel_id?: string;
	notification_type?: number;
	active: number;
	clan_id: string;
	is_current_channel?: boolean;
};

export const setMuteNotificationSetting = createAsyncThunk(
	'notificationsetting/setMuteNotificationSetting',
	async ({ channel_id, notification_type, active, clan_id, is_current_channel = true }: SetMuteNotificationPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const body = {
			id: channel_id,
			notification_type: notification_type,
			active: active
		};
		const response = await mezon.client.setMuteNotificationChannel(mezon.session, body);
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(defaultNotificationCategoryActions.fetchChannelCategorySetting({ clanId: clan_id || '' }));
		thunkAPI.dispatch(getNotificationSetting({ channelId: channel_id || '', isCurrentChannel: is_current_channel }));
		return response;
	}
);

type DeleteNotiChannelSettingPayload = {
	channel_id?: string;
	clan_id?: string;
	is_current_channel?: boolean;
};

export const deleteNotiChannelSetting = createAsyncThunk(
	'notificationsetting/deleteNotiChannelSetting',
	async ({ channel_id, clan_id, is_current_channel = true }: DeleteNotiChannelSettingPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.deleteNotificationChannel(mezon.session, channel_id || '');
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(defaultNotificationCategoryActions.fetchChannelCategorySetting({ clanId: clan_id || '' }));
		thunkAPI.dispatch(getNotificationSetting({ channelId: channel_id || '', isCurrentChannel: is_current_channel }));
		return response;
	}
);

export const notificationSettingSlice = createSlice({
	name: NOTIFICATION_SETTING_FEATURE_KEY,
	initialState: initialNotificationSettingState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotificationSetting.pending, (state: NotificationSettingState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(getNotificationSetting.fulfilled, (state: NotificationSettingState, action: PayloadAction<GetNotificationSettingResponse>) => {
				const isCurrentChannel = action.payload.isCurrentChannel;
				if (isCurrentChannel) {
					state.currentChannelNotificationSetting = action.payload.notificationSetting;
				}
				state.selectedChannelNotificationSetting = action.payload.notificationSetting;
				state.loadingStatus = 'loaded';
			})
			.addCase(getNotificationSetting.rejected, (state: NotificationSettingState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

/*
 * Export reducer for store configuration.
 */
export const notificationSettingReducer = notificationSettingSlice.reducer;

export const notificationSettingActions = {
	...notificationSettingSlice.actions,
	getNotificationSetting,
	setNotificationSetting,
	deleteNotiChannelSetting,
	setMuteNotificationSetting
};

export const getNotificationSettingState = (rootState: { [NOTIFICATION_SETTING_FEATURE_KEY]: NotificationSettingState }): NotificationSettingState =>
	rootState[NOTIFICATION_SETTING_FEATURE_KEY];

export const selectCurrentChannelNotificatonSelected = createSelector(
	getNotificationSettingState,
	(state: NotificationSettingState) => state.currentChannelNotificationSetting
);

export const selectSelectedChannelNotificationSetting = createSelector(
	getNotificationSettingState,
	(state: NotificationSettingState) => state.selectedChannelNotificationSetting
);
