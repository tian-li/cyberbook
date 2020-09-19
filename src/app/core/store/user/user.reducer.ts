import { Action, createReducer, on } from '@ngrx/store';
import { User } from '@cyberbook/core/model/user';
import {
  loginWithLocalTokenSuccess,
  loginSuccess,
  logout,
  registerSuccess,
  registerTempUserSuccess,
  saveTempUserSuccess,
  updateProfileSuccess
} from './user.actions';

export const userFeatureKey = 'user';

const defaultTempUser: Partial<User> = {
  username: '立即注册',
  registered: false
}

export interface State {
  user: Partial<User>;
  isAuthenticated: boolean;
}

export const initialState: State = {
  user: defaultTempUser,
  isAuthenticated: false
};

const reducer = createReducer(
  initialState,
  on(updateProfileSuccess, (state, { user }) => ({ ...state, user: { ...state.user, ...user }, isAuthenticated: true })),
  on(loginSuccess, registerSuccess, registerTempUserSuccess, saveTempUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true
  })),

  on(loginWithLocalTokenSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      isAuthenticated: true
    }
  }),
  on(logout, () => initialState)
);

export function userReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
