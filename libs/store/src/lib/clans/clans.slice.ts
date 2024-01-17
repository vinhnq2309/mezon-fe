import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IClan } from '@mezon/utils';

export const CLANS_FEATURE_KEY = 'clans';

/*
 * Update these interfaces according to your requirements.
 */
export interface ClansEntity extends IClan {
  id: string; // Primary ID
}

export interface ClansState extends EntityState<ClansEntity, string> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  currentClanId?: string | null;
}

export const clansAdapter = createEntityAdapter<ClansEntity>();

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
 *   dispatch(fetchClans())
 * }, [dispatch]);
 * ```
 */
export const fetchClans = createAsyncThunk<ClansEntity[]>(
  'clans/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getClanss()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const initialClansState: ClansState = clansAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
});

export const clansSlice = createSlice({
  name: CLANS_FEATURE_KEY,
  initialState: initialClansState,
  reducers: {
    add: clansAdapter.addOne,
    remove: clansAdapter.removeOne,
    changeCurrentClan: (state, action: PayloadAction<string>) => {
      state.currentClanId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClans.pending, (state: ClansState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchClans.fulfilled,
        (state: ClansState, action: PayloadAction<ClansEntity[]>) => {
          clansAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchClans.rejected, (state: ClansState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const clansReducer = clansSlice.reducer;

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
 *   dispatch(clansActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const clansActions = clansSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllClans);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = clansAdapter.getSelectors();

export const getClansState = (rootState: {
  [CLANS_FEATURE_KEY]: ClansState;
}): ClansState => rootState[CLANS_FEATURE_KEY];

export const selectAllClans = createSelector(getClansState, selectAll);

export const selectClansEntities = createSelector(
  getClansState,
  selectEntities
);

export const selectClanById = (id: string) => createSelector(
  selectClansEntities,
  (clansEntities) => clansEntities[id]
);

export const selectCurrentClanId = createSelector(
  getClansState,
  (state) => state.currentClanId
);

export const selectCurrentClan = createSelector(
  selectClansEntities,
  selectCurrentClanId,
  (clansEntities, clanId) => clanId ? clansEntities[clanId] : null
);