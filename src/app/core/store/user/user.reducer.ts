import { User } from '@cyberbook/core/model/user';
import { defaultTheme } from '@cyberbook/shared/constants';
import { Action, createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginWithLocalTokenSuccess,
  logout,
  registerSuccess,
  registerTempUserSuccess,
  savePreferredThemeSuccess,
  saveTempUserSuccess,
  updateProfileSuccess
} from './user.actions';

export const userFeatureKey = 'user';

const defaultTempUser: Partial<User> = {
  username: '立即注册',
  registered: false,
  theme: defaultTheme,
};

export interface State {
  user: Partial<User>;
  isAuthenticated: boolean;
  theme: string;
}

export const initialState: State = {
  user: defaultTempUser,
  isAuthenticated: false,
  theme: null,
};

const reducer = createReducer(
  initialState,
  on(updateProfileSuccess, (state, { user }) => ({
    ...state,
    user: { ...state.user, ...user },
    isAuthenticated: true
  })),
  on(loginSuccess, registerSuccess, registerTempUserSuccess, saveTempUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    theme: user.theme ? user.theme : defaultTheme
  })),
  on(savePreferredThemeSuccess, (state, { theme }) => {
    return {
      ...state,
      theme,
    };
  }),
  on(loginWithLocalTokenSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      isAuthenticated: true,
      theme: user.theme ? user.theme : defaultTheme
    };
  }),
  on(logout, () => initialState)
  )
;

export function userReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
