import { IClanProfile, LoadingStatus, TypeCheck } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/browser';
import { ApiUpdateClanProfileRequest } from 'mezon-js';
import { ApiClanProfile } from 'mezon-js/api.gen';
import { ensureClient, ensureSession, ensureSocket, getMezonCtx } from '../helpers';
export const USER_CLAN_PROFILE_FEATURE_KEY = 'userClanProfile';

export interface UserClanProfileEntity extends IClanProfile {
	id: string; // Primary ID
}

export const mapUserClanProfileToEntity = (userClanProfileRes: ApiClanProfile) => {
	const id = `${userClanProfileRes.clan_id}${userClanProfileRes.user_id}`;
	return { ...userClanProfileRes, id };
};

export interface UserClanProfileState extends EntityState<UserClanProfileEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	currentUserClanProfileId?: string | null;
	showModalFooterProfile: boolean;
	showModalCustomStatus: boolean;
}

export const userClanProfileAdapter = createEntityAdapter<UserClanProfileEntity>();

type fetchUserClanProfilePayload = {
	clanId: string;
};

export const fetchUserClanProfile = createAsyncThunk('userclanProfile/userClanProfile', async ({ clanId }: fetchUserClanProfilePayload, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.getUserProfileOnClan(mezon.session, clanId);
	if (!response) {
		return thunkAPI.rejectWithValue([]);
	}
	const userClanProfileEntity = mapUserClanProfileToEntity(response);
	return userClanProfileEntity;
});

export const checkDuplicateClanNickName = createAsyncThunk(
	'userClanProfile/duplicateClanNickName',
	async ({ clanNickName, clanId }: { clanNickName: string; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSocket(getMezonCtx(thunkAPI));
			const isDuplicateName = await mezon.socketRef.current?.checkDuplicateName(clanNickName, clanId, TypeCheck.TYPENICKNAME);

			if (isDuplicateName?.type === TypeCheck.TYPENICKNAME) {
				return isDuplicateName.exist;
			}
			return;
		} catch (error) {
			Sentry.captureException(error);
			return thunkAPI.rejectWithValue([]);
		}
	}
);

type updateLinkUserClanProfile = {
	username: string;
	avatarUrl: string;
	clanId: string;
};

export const updateUserClanProfile = createAsyncThunk(
	'userclanProfile/updateUserClanProfile',
	async ({ clanId, username, avatarUrl }: updateLinkUserClanProfile, thunkAPI) => {
		const mezon = ensureClient(getMezonCtx(thunkAPI));
		const body: ApiUpdateClanProfileRequest = {
			clan_id: clanId,
			nick_name: username || '',
			avatar: avatarUrl || ''
		};
		const response = await mezon.client.updateUserProfileByClan(mezon.session, clanId, body);
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(fetchUserClanProfile({ clanId }));
		return response as true;
	}
);

export const initialUserClanProfileState: UserClanProfileState = userClanProfileAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	showModalFooterProfile: false,
	showModalCustomStatus: false
});

export const userClanProfileSlice = createSlice({
	name: USER_CLAN_PROFILE_FEATURE_KEY,
	initialState: initialUserClanProfileState,
	reducers: {
		add: userClanProfileAdapter.addOne,
		remove: userClanProfileAdapter.removeOne,
		changeUserClanProfile: (state, action: PayloadAction<string>) => {
			state.currentUserClanProfileId = action.payload;
		},
		setShowModalFooterProfile: (state, action: PayloadAction<boolean>) => {
			state.showModalFooterProfile = action.payload;
		},
		setShowModalCustomStatus: (state, action: PayloadAction<boolean>) => {
			state.showModalCustomStatus = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserClanProfile.pending, (state: UserClanProfileState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchUserClanProfile.fulfilled, (state: UserClanProfileState, action: PayloadAction<UserClanProfileEntity>) => {
				userClanProfileAdapter.setOne(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchUserClanProfile.rejected, (state: UserClanProfileState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

export const userClanProfileReducer = userClanProfileSlice.reducer;

export const userClanProfileActions = {
	...userClanProfileSlice.actions,
	fetchUserClanProfile,
	updateUserClanProfile
};

const { selectAll } = userClanProfileAdapter.getSelectors();

export const getUserClanProfileState = (rootState: { [USER_CLAN_PROFILE_FEATURE_KEY]: UserClanProfileState }): UserClanProfileState =>
	rootState[USER_CLAN_PROFILE_FEATURE_KEY];

export const selectAllUserClanProfile = createSelector(getUserClanProfileState, selectAll);

export const selectUserClanProfileByClanID = (clanId: string, userId: string) =>
	createSelector(selectAllUserClanProfile, (profiles) => profiles.find((pr) => pr.clan_id === clanId && pr.user_id === userId));

export const selectShowModalFooterProfile = createSelector(getUserClanProfileState, (state) => state.showModalFooterProfile);

export const selectShowModalCustomStatus = createSelector(getUserClanProfileState, (state) => state.showModalCustomStatus);
