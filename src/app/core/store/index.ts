// import {
//   ActionReducerMap,
//   MetaReducer,
//   createFeatureSelector
// } from "@ngrx/store";
//
// import * as fromAuth from "./auth/auth.reducer";
// import { authReducer } from "./auth/auth.reducer";
// import * as fromRoot from '../../reducers';
//
// export interface State extends fromRoot.State {
//   auth: fromAuth.State;
// }
//
// export const reducers: ActionReducerMap<State> = {
//   auth: authReducer,
// };
//
// export const selectAuthState = createFeatureSelector<State, fromAuth.State>(
//   "auth"
// );
//
