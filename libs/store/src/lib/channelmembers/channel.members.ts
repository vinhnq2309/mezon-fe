import { IChannelMember, LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { MezonValueContext, ensureSession, ensureSocket, getMezonCtx } from '../helpers';
import { ChannelUserListChannelUser } from '@mezon/mezon-js/dist/api.gen';
import { ChannelPresenceEvent } from 'vendors/mezon-js/packages/mezon-js/dist';
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import memoize from 'memoizee';

const CHANNEL_MEMBERS_CACHED_TIME = 1000 * 60 * 3;
export const CHANNEL_MEMBERS_FEATURE_KEY = 'channelMembers';

/*
 * Update these interfaces according to your requirements.
 */
export interface ChannelMembersEntity extends IChannelMember {
	id: string; // Primary ID
}

// TODO: remove channelId from the parameter
export const mapChannelMemberToEntity = (channelRes: ChannelUserListChannelUser, channelId?: string) => {
	return { ...channelRes, id: channelRes?.user?.id || '', channelId };
};

export const mapUserIdToEntity = (userId: string, username: string) => {
	return { username: username, id: userId };
};

export interface ChannelMembersState extends EntityState<ChannelMembersEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	currentChannelId?: string | null;
}

export interface ChannelMemberRootState {
	[CHANNEL_MEMBERS_FEATURE_KEY]: ChannelMembersState;
}

function getChannelMemberRootState(thunkAPI: GetThunkAPI<unknown>): ChannelMemberRootState {
	return thunkAPI.getState() as ChannelMemberRootState;
}

export const channelMembersAdapter = createEntityAdapter<ChannelMembersEntity>();

const fetchChannelMembersCached = memoize(
	(mezon: MezonValueContext, channelId: string) => mezon.client.listChannelUsers(mezon.session, channelId, 1, 100, ''),
	{
		promise: true,
		maxAge: CHANNEL_MEMBERS_CACHED_TIME,
		normalizer: (args) => args[1],
	},
);

type fetchChannelMembersPayload = {
	channelId: string;
	noCache?: boolean;
};

export const fetchChannelMembers = createAsyncThunk(
	'channelMembers/fetchStatus',
	async ({ channelId, noCache }: fetchChannelMembersPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		if (noCache) {
			fetchChannelMembersCached.clear(mezon, channelId);
		}

		const response = await fetchChannelMembersCached(mezon, channelId);
		if (!response.channel_users) {
			return thunkAPI.rejectWithValue([]);
		}
		const members = response.channel_users.map((channelRes) => mapChannelMemberToEntity(channelRes, channelId));
		thunkAPI.dispatch(channelMembersActions.addMany(members));
		thunkAPI.dispatch(channelMembersActions.followUserStatus());
		return members;
	},
);

export const followUserStatus = createAsyncThunk('channelMembers/followUserStatus', async (_, thunkAPI) => {
	const mezon = await ensureSocket(getMezonCtx(thunkAPI));
	const listUserIds = selectAllUserIds(getChannelMemberRootState(thunkAPI));
	const response = mezon.addStatusFollow(listUserIds);
	if (!response) {
		return thunkAPI.rejectWithValue([]);
	}
	return response;
});

export const fetchChannelMembersPresence = createAsyncThunk(
	'channelMembers/fetchChannelMembersPresence',
	async (channelPresence: ChannelPresenceEvent, thunkAPI) => {
		//user exist
		const userId = channelPresence.joins[0].user_id;
		const channelId = channelPresence.channel_id;

		const user = selectMemberById(userId)(getChannelMemberRootState(thunkAPI));

		if (!user) {
			thunkAPI.dispatch(fetchChannelMembers({ channelId }));
		}
	},
);

export const initialChannelMembersState: ChannelMembersState = channelMembersAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
});

export const channelMembers = createSlice({
	name: CHANNEL_MEMBERS_FEATURE_KEY,
	initialState: initialChannelMembersState,
	reducers: {
		add: channelMembersAdapter.addOne,
		remove: channelMembersAdapter.removeOne,
		onChannelPresence: (state: ChannelMembersState, action: PayloadAction<IChannelMember>) => {
			channelMembersAdapter.addOne(state, action.payload);
		},
		addMany: channelMembersAdapter.addMany,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchChannelMembers.pending, (state: ChannelMembersState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchChannelMembers.fulfilled, (state: ChannelMembersState, action: PayloadAction<IChannelMember[]>) => {
				channelMembersAdapter.setMany(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchChannelMembers.rejected, (state: ChannelMembersState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const channelMembersReducer = channelMembers.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(channelMembersActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const channelMembersActions = { ...channelMembers.actions, fetchChannelMembers, fetchChannelMembersPresence, followUserStatus };

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(fetchChannelMembers);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities, selectById } = channelMembersAdapter.getSelectors();

export const getChannelMembersState = (rootState: { [CHANNEL_MEMBERS_FEATURE_KEY]: ChannelMembersState }): ChannelMembersState =>
	rootState[CHANNEL_MEMBERS_FEATURE_KEY];

export const selectAllChannelMembers = createSelector(getChannelMembersState, selectAll);

export const selectChannelMembesEntities = createSelector(getChannelMembersState, selectEntities);

export const selectAllUserIds = createSelector(selectChannelMembesEntities, (entities) => {
	const members = Object.values(entities);
	return members.filter((item) => item.user?.id).map((member) => member.user?.id as string);
});

export const selectMembersByChannelId = (channelId?: string | null) =>
	createSelector(selectChannelMembesEntities, (entities) => {
		const members = Object.values(entities);
		return members.filter((member) => member && member.user !== null && member.channelId === channelId);
	});

export const selectChannelMemberByUserIds = (channelId: string, userIds: string[]) =>
	createSelector(selectChannelMembesEntities, (entities) => {
		const members = Object.values(entities);
		return members.filter((member) => userIds && member?.user?.id && member.channelId === channelId && userIds.includes(member?.user?.id));
	});

export const selectMemberById = (userId: string) =>
	createSelector(getChannelMembersState, (state) => {
		return selectById(state, userId);
	});
