import { IChannel } from '@mezon/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

export const CHANNELS_FEATURE_KEY = 'channels';

/*
 * Update these interfaces according to your requirements.
 */
export interface ChannelsEntity extends IChannel {
  id: string; // Primary ID
}

export interface ChannelsState extends EntityState<ChannelsEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  currentChannelId?: string | null;
}

export const channelsAdapter = createEntityAdapter<ChannelsEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
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
 *   dispatch(fetchChannels())
 * }, [dispatch]);
 * ```
 */
export const fetchChannels = createAsyncThunk<ChannelsEntity[]>(
  'channels/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getChannelss()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const initialChannelsState: ChannelsState =
  channelsAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const channelsSlice = createSlice({
  name: CHANNELS_FEATURE_KEY,
  initialState: initialChannelsState,
  reducers: {
    add: channelsAdapter.addOne,
    remove: channelsAdapter.removeOne,
    changeCurrentChanel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state: ChannelsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchChannels.fulfilled,
        (state: ChannelsState, action: PayloadAction<ChannelsEntity[]>) => {
          channelsAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchChannels.rejected, (state: ChannelsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const channelsReducer = channelsSlice.reducer;

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
 *   dispatch(channelsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const channelsActions = channelsSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllChannels);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = channelsAdapter.getSelectors();

export const getChannelsState = (rootState: {
  [CHANNELS_FEATURE_KEY]: ChannelsState;
}): ChannelsState => rootState[CHANNELS_FEATURE_KEY];

export const selectAllChannels = createSelector(getChannelsState, selectAll);

export const selectChannelsEntities = createSelector(
  getChannelsState,
  selectEntities
);

export const selectChannelById = (id: string) => createSelector(
  selectChannelsEntities,
  (clansEntities) => clansEntities[id]
);

export const selectCurrentChannelId = createSelector(
  getChannelsState,
  (state) => state.currentChannelId
);

export const selectCurrentChannel = createSelector(
  selectChannelsEntities,
  selectCurrentChannelId,
  (clansEntities, clanId) => clanId ? clansEntities[clanId] : null
);