import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootState } from '@cyberbook/core/store';
import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<RootState, fromUser.State>(
  fromUser.userFeatureKey
);

export const selectUser = createSelector(
  selectUserState,
  (state: fromUser.State) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (state: fromUser.State) => state.isAuthenticated
);
