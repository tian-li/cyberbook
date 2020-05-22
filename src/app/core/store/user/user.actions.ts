import { createAction, props } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';

export const register = createAction('[User] Register', props<{ user: Partial<User> }>());
export const registerSuccess = createAction('[User] Register Success', props<{ user: Partial<User> }>());
export const registerFail = createAction('[User] Register Fail', props<{ errorMessage: any }>());

export const updateProfile = createAction('[User] Update Profile', props<{ user: Partial<User> }>());
export const updateProfileSuccess = createAction('[User] Update Profile Success', props<{ user: Partial<User> }>());
export const updateProfileFail = createAction('[User] Update Profile Fail', props<{ errorMessage: any }>());

export const login = createAction('[User] Login', props<{ user: User }>());
export const loginSuccess = createAction('[User] Login Success', props<{ user: User }>());
export const loginFail = createAction('[User] Login Fail', props<{ errorMessage: any }>());

export const logout = createAction('[User] Logout', props<{ id: string }>());
