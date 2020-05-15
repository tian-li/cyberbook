import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootState } from '@spend-book/core/store';
import * as fromAuth from './auth.reducer';

// const selectAuth = createSelector(
//   selectAuthState,
//   (state: AuthState) => state
// );
//
// const selectIsAuthenticated = createSelector(
//   selectAuthState,
//   (state: AuthState) => state.isAuthenticated
// );
//

/**
 * Auth Reducers
 */
export const selectAuthState = createFeatureSelector<RootState, fromAuth.State>(
  fromAuth.authFeatureKey
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.isAuthenticated
);
