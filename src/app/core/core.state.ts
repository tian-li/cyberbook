import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from "@ngrx/store";

import { AuthState } from "./store/auth/auth.reducer";
import { authReducer } from "./store/auth/auth.reducer";

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  "auth"
);

export const selectSettingsState = createFeatureSelector<AppState>("settings");

export const selectRouterState = createFeatureSelector<AppState>("router");

export interface AppState {
  auth: AuthState;
}
