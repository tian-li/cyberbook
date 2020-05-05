import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../index';
import { AuthState } from './auth.reducer';

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);
