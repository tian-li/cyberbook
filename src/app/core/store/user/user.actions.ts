import { User } from '@cyberbook/core/model/user';
import { createAction, props } from '@ngrx/store';

export const register = createAction('[User] Register',
  props<{ user: Partial<User>, password: string }>()
);
export const registerSuccess = createAction('[User] Register Success', props<{ user: Partial<User> }>());
export const registerFail = createAction('[User] Register Fail', props<{ errorMessage: any }>());

export const savePreferredTheme = createAction('[User] Save Preferred Theme', props<{ theme: string }>());
export const savePreferredThemeSuccess = createAction(
  '[User] Save Preferred Theme Success',
  props<{ theme: string }>()
);

export const updateProfile = createAction('[User] Update Profile', props<{ user: Partial<User> }>());
export const updateProfileSuccess = createAction('[User] Update Profile Success', props<{ user: Partial<User> }>());
export const updateProfileFail = createAction('[User] Update Profile Fail', props<{ errorMessage: any }>());

export const login = createAction('[User] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[User] Login Success', props<{ user: User }>());
export const loginFail = createAction('[User] Login Fail', props<{ errorMessage: any }>());

export const logout = createAction('[User] Logout');

export const loginWithLocalToken = createAction('[User] Login With Local Token');
export const loginWithLocalTokenSuccess = createAction(
  '[User] Login With Local Token Success',
  props<{ user: User }>()
);

export const registerTempUser = createAction('[User] Register Temp User',
  props<{ user: Partial<User> }>()
);
export const registerTempUserSuccess = createAction(
  '[User] Register Temp User Success',
  props<{ user: Partial<User> }>()
);

export const saveTempUser = createAction('[User] Save Temp User', props<{ user: Partial<User>, password: string }>());
export const saveTempUserSuccess = createAction('[User] Save Temp User Success', props<{ user: Partial<User> }>());
