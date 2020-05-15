import { authLogin, authLogout } from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const authFeatureKey = 'auth';

export interface State {
  isAuthenticated: boolean;
}

export const initialState: State = {
  isAuthenticated: true
};

const reducer = createReducer(
  initialState,
  on(authLogin, state => ({ ...state, isAuthenticated: true })),
  on(authLogout, state => ({ ...state, isAuthenticated: false }))
);

export function authReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

// export const getIsAuthenticated = (state: State) => state.isAuthenticated;
