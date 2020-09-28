import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@cyberbook/core/model/user';
import { UserService } from '@cyberbook/core/services/user.service';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import {
  login,
  loginSuccess,
  loginWithLocalToken,
  loginWithLocalTokenSuccess,
  logout,
  register,
  registerSuccess,
  registerTempUser,
  registerTempUserSuccess,
  saveTempUser,
  saveTempUserSuccess, savePreferredTheme,
  updateProfile,
  updateProfileSuccess, savePreferredThemeSuccess
} from './user.actions';

@Injectable()
export class UserEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(action =>
        this.userService.login(action.email, action.password).pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            this.router.navigate(['/home']);
            return loginSuccess({ user });
          }),
        )
      )
    )
  );

  loadUserFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithLocalToken),
      switchMap(() =>
        this.userService.loginWithToken().pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            return loginWithLocalTokenSuccess({ user });
          }),
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap(action =>
        this.userService.register(action.user, action.password).pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            if (user.registered) {
              this.router.navigate(['/user']);
            }
            return registerSuccess({ user });
          }),
        )
      )
    )
  );

  registerTempUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerTempUser),
      switchMap(() =>
        this.userService.registerTempUser().pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            return registerTempUserSuccess({ user });
          }),
        )
      )
    )
  );


  saveTempUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveTempUser),
      switchMap(action =>
        this.userService.saveTempUser(action.user, action.password).pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            if (user.registered) {
              this.router.navigate(['/user']);
            }
            return saveTempUserSuccess({ user });
          }),
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfile),
      switchMap(action =>
        this.userService.updateProfile(action.user).pipe(
          switchMap((user: User) => {
            this.saveUserToLocalstorage(user);
            this.router.navigate(['/user']);
            return [
              notifyWithSnackBar({ snackBar: { message: '更新成功' } }),
              updateProfileSuccess({ user }),
            ];
          }),
        )
      )
    )
  );

  setTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savePreferredTheme),
      switchMap(({ theme }) =>
        this.userService.setTheme(theme).pipe(
          map(() => {
            return savePreferredThemeSuccess({ theme });
          }),
        )
      )
    )
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(logout),
        map(() => {
          localStorage.clear();
          this.router.navigate(['/user/login']);
        })
      ),
    { dispatch: false }
  );

  private saveUserToLocalstorage(user: User) {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('jwt_token', user.jwtToken);
    localStorage.setItem('registered', String(user.registered));
  }

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private router: Router
  ) {
  }
}
