import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>(
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

export const selectTheme = createSelector(
  selectUserState,
  (state: fromUser.State) => state.theme
);
