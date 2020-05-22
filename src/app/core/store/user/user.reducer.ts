import { Action, createReducer, on } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { login, loginSuccess, logout, register, registerSuccess, updateProfile, updateProfileSuccess } from './user.actions';

export const userFeatureKey = 'user';

export interface State {
  user: User;
  isAuthenticated: boolean;
}

export const initialState: State = {
  user: <User>{ username: '立即注册', registered: false },
  isAuthenticated: false
};

const reducer = createReducer(
  initialState,
  on(updateProfileSuccess, (state, { user }) => ({ ...state, user: { ...state.user, ...user }, isAuthenticated: true })),
  on(loginSuccess, registerSuccess, (state, { user }) => ({ ...state, user, isAuthenticated: true })),
  on(logout, (state, { id }) => ({ ...state, user: null, isAuthenticated: false }))
);

export function userReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
