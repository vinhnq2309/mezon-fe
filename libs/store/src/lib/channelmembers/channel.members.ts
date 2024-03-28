import { ChannelPresenceEvent, ChannelType, StatusPresenceEvent } from '@mezon/mezon-js';
import { ChannelUserListChannelUser } from '@mezon/mezon-js/dist/api.gen';
import { IChannelMember, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import memoize from 'memoizee';
import { MezonValueContext, ensureSession, ensureSocket, getMezonCtx } from '../helpers';

const CHANNEL_MEMBERS_CACHED_TIME = 1000 * 60 * 3;
export const CHANNEL_MEMBERS_FEATURE_KEY = 'channelMembers';

/*
 * Update these interfaces according to your requirements.
 */
export interface ChannelMembersEntity extends IChannelMember {
	id: string; // Primary ID
	name?: string;
}

export interface ChannelMemberAvatar {
	avatar: string;
	name: string;
}

// TODO: remove channelId from the parameter
export const mapChannelMemberToEntity = (channelRes: ChannelUserListChannelUser, channelId?: string) => {
	const id = channelRes.id ? channelRes.id : `${channelId}${channelRes.user?.id}`;
	return { ...channelRes, id: id || '', channelId };
};

export const mapUserIdToEntity = (userId: string, username: string) => {
	return { username: username, id: userId };
};

export interface ChannelMembersState extends EntityState<ChannelMembersEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	currentChannelId?: string | null;
	followingUserIds?: string[];
	onlineStatusUser: Record<string, boolean>;
	toFollowUserIds: string[];
	voiceChannelMember: IChannelMember[];
}

export interface ChannelMemberRootState {
	[CHANNEL_MEMBERS_FEATURE_KEY]: ChannelMembersState;
}

function getChannelMemberRootState(thunkAPI: GetThunkAPI<unknown>): ChannelMemberRootState {
	return thunkAPI.getState() as ChannelMemberRootState;
}

export const channelMembersAdapter = createEntityAdapter<ChannelMembersEntity>();

const fetchChannelMembersCached = memoize(
	(mezon: MezonValueContext, clanId: string, channelId: string, channelType: ChannelType) =>
		mezon.client.listChannelUsers(mezon.session, clanId, channelId, channelType, 1, 100, ''),
	{
		promise: true,
		maxAge: CHANNEL_MEMBERS_CACHED_TIME,
		normalizer: (args) => args[1],
	},
);

type fetchChannelMembersPayload = {
	clanId: string;
	channelId: string;
	noCache?: boolean;
	channelType: ChannelType;
};

export const fetchChannelMembers = createAsyncThunk(
	'channelMembers/fetchChannelMembers',
	async ({ clanId, channelId, noCache, channelType }: fetchChannelMembersPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		if (noCache) {
			fetchChannelMembersCached.clear(mezon, clanId, channelId, channelType);
		}

		const response = await fetchChannelMembersCached(mezon, clanId, channelId, channelType);
		if (!response.channel_users) {
			return thunkAPI.rejectWithValue([]);
		}
		const members = response.channel_users.map((channelRes) => mapChannelMemberToEntity(channelRes, channelId));
		thunkAPI.dispatch(channelMembersActions.addMany(members));
		const userIds = members.map((member) => member.user?.id || '');
		thunkAPI.dispatch(channelMembersActions.addUserIdsToFollow(userIds));
		thunkAPI.dispatch(channelMembersActions.followUserStatus());
		return members;
	},
);

const fetchVoiceChannelMembersCached = memoize(
	(mezon: MezonValueContext, clanId: string, channelId: string, channelType: ChannelType) =>
		mezon.client.listChannelVoiceUsers(mezon.session, clanId, channelId, channelType, 1, 100, ''),
	{
		promise: true,
		maxAge: CHANNEL_MEMBERS_CACHED_TIME,
		normalizer: (args) => args[1],
	},
);

type fetchVoiceChannelMembersPayload = {
	clanId: string;
	channelId: string;
	noCache?: boolean;
	channelType: ChannelType;
};

export const fetchVoiceChannelMembers = createAsyncThunk(
	'channelMembers/fetchVoiceChannelMembers',
	async ({ clanId, channelId, noCache, channelType }: fetchVoiceChannelMembersPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		if (noCache) {
			fetchVoiceChannelMembersCached.clear(mezon, clanId, channelId, channelType);
		}

		const response = await fetchVoiceChannelMembersCached(mezon, clanId, channelId, channelType);
		if (!response.channel_users) {
			return thunkAPI.rejectWithValue([]);
		}
		return response.channel_users;
	},
);

export const followUserStatus = createAsyncThunk('channelMembers/followUserStatus', async (_, thunkAPI) => {
	const mezon = await ensureSocket(getMezonCtx(thunkAPI));
	const listUserIds = selectAllUserIdsToFollow(getChannelMemberRootState(thunkAPI));
	const listFollowingUserIds = selectFollowingUserIds(getChannelMemberRootState(thunkAPI));
	if (listUserIds.length !== listFollowingUserIds?.length || listUserIds.some((id) => !listFollowingUserIds.includes(id))) {
		const response = await mezon.addStatusFollow(listUserIds);
		const onlineStatus = response.presences.map((item) => {
			return { userId: item.user_id, status: true };
		});
		thunkAPI.dispatch(channelMembersActions.setManyStatusUser(onlineStatus));
		if (mezon.sessionRef.current?.user_id) {
			thunkAPI.dispatch(channelMembersActions.setStatusUser({ userId: mezon.sessionRef.current?.user_id, status: true }));
		}
		thunkAPI.dispatch(channelMembersActions.setFollowingUserIds(listUserIds));
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		return response;
	}
});

export const fetchChannelMembersPresence = createAsyncThunk(
	'channelMembers/fetchChannelMembersPresence',
	async (channelPresence: ChannelPresenceEvent, thunkAPI) => {
		//user exist
		if (channelPresence.joins.length > 0) {
			const userId = channelPresence.joins[0].user_id;
			const channelId = channelPresence.channel_id;
			const user = selectMemberById(userId)(getChannelMemberRootState(thunkAPI));
			if (!user) {
				thunkAPI.dispatch(fetchChannelMembers({ clanId: '', channelId: channelId, channelType: ChannelType.CHANNEL_TYPE_TEXT }));
			}
		}
	},
);

export const updateStatusUser = createAsyncThunk('channelMembers/fetchUserStatus', async (statusPresence: StatusPresenceEvent, thunkAPI) => {
	//user exist
	if (statusPresence?.leaves?.length) {
		for (const leave of statusPresence.leaves) {
			const userId = leave.user_id;
			thunkAPI.dispatch(channelMembersActions.setStatusUser({ userId, status: false }));
		}
	}
	if (statusPresence?.joins?.length) {
		for (const join of statusPresence.joins) {
			const userId = join.user_id;
			thunkAPI.dispatch(channelMembersActions.setStatusUser({ userId, status: true }));
		}
	}
});

export const initialChannelMembersState: ChannelMembersState = channelMembersAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	onlineStatusUser: {},
	toFollowUserIds: [],
	voiceChannelMember: [],
});

export type StatusUserArgs = {
	userId: string;
	status: boolean;
};

export const channelMembers = createSlice({
	name: CHANNEL_MEMBERS_FEATURE_KEY,
	initialState: initialChannelMembersState,
	reducers: {
		add: channelMembersAdapter.addOne,
		remove: channelMembersAdapter.removeOne,
		setManyStatusUser: (state, action: PayloadAction<StatusUserArgs[]>) => {
			for (let i of action.payload) {
				state.onlineStatusUser[i.userId] = i.status;
			}
		},
		addMany: channelMembersAdapter.addMany,
		setFollowingUserIds: (state: ChannelMembersState, action: PayloadAction<string[]>) => {
			state.followingUserIds = action.payload;
		},
		setStatusUser: (state, action: PayloadAction<StatusUserArgs>) => {
			state.onlineStatusUser[action.payload.userId] = action.payload.status;
		},
		addUserIdsToFollow: (state: ChannelMembersState, action: PayloadAction<string[]>) => {
			const newUsers = [...state.toFollowUserIds, ...action.payload];
			state.toFollowUserIds = [...new Set(newUsers)];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchChannelMembers.pending, (state: ChannelMembersState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchChannelMembers.fulfilled, (state: ChannelMembersState, action: PayloadAction<IChannelMember[]>) => {
				channelMembersAdapter.addMany(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchChannelMembers.rejected, (state: ChannelMembersState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(fetchVoiceChannelMembers.pending, (state: ChannelMembersState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchVoiceChannelMembers.fulfilled, (state: ChannelMembersState, action: PayloadAction<any>) => {
				// channelMembersAdapter.addMany(state, action.payload);
				state.voiceChannelMember = action.payload;
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchVoiceChannelMembers.rejected, (state: ChannelMembersState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

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
export const channelMembersActions = {
	...channelMembers.actions,
	fetchChannelMembers,
	fetchChannelMembersPresence,
	followUserStatus,
	updateStatusUser,
	fetchVoiceChannelMembers,
};

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

export const selectFollowingUserIds = createSelector(getChannelMembersState, (state) => state.followingUserIds);

export const selectAllUserIds = createSelector(selectChannelMembesEntities, (entities) => {
	const members = Object.values(entities);
	return members.filter((item) => item.user?.id).map((member) => member.user?.id as string);
});

export const selectAllUserIdsToFollow = createSelector(getChannelMembersState, (state) => {
	return state.toFollowUserIds;
});

export const selectMembersByChannelId = (channelId?: string | null) =>
	createSelector(selectChannelMembesEntities, (entities) => {
		const members = Object.values(entities);
		return members.filter((member) => member && member.user !== null && member.channelId === channelId);
	});

export const selectVoiceChannelMembersByChannelId = (channelId?: string | null) =>
	createSelector(selectChannelMembesEntities, (entities) => {
		const voiceMembers = Object.values(entities);
		console.log('voiceMembers-2', voiceMembers);
		return voiceMembers.filter((member) => member && member.user !== null && member.id === channelId);
	});

export const selectMembersMap = (channelId?: string | null) =>
	createSelector(selectChannelMembesEntities, (entities) => {
		const retval = new Map<string, ChannelMemberAvatar>();
		const members = Object.values(entities);

		members
			.filter((member) => member && member.user !== null && member.user?.id && member.channelId === channelId)
			.map((member) => {
				const key = member.user?.id as string;
				retval.set(key, { name: member.user?.username || '', avatar: member.user?.avatar_url || '' });
			});

		return retval;
	});
export const selectMemberStatus = createSelector(getChannelMembersState, (state) => state.onlineStatusUser);

export const selectMemberOnlineStatusById = (userId: string) =>
	createSelector(selectMemberStatus, (status) => {
		return status?.[userId] || false;
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

export const selectMemberByUserId = (userId: string) =>
	createSelector(selectAllChannelMembers, (entities) => {
		return entities.find((ent) => ent?.user?.id === userId) || null;
	});
