import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { User } from '@spend-book/core/model/user';
import { UserService } from '@spend-book/core/services/user.service';
import { notifyWithSnackBar } from '@spend-book/core/store/notification';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  loadUserFromLocalStorage,
  loadUserFromLocalStorageSuccess,
  login,
  loginSuccess,
  register,
  registerSuccess, registerTempUser, registerTempUserSuccess,
  updateProfile,
  updateProfileSuccess
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
            this.router.navigate(['/user']);
            return loginSuccess({ user });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '登录失败' } })))
        )
      )
    )
  );

  loadUserFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserFromLocalStorage),
      switchMap(action =>
        this.userService.getUserById(action.userId).pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            return loadUserFromLocalStorageSuccess({ user });

          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '载入本地用户失败' } })))
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
            console.log('register success', user)
            if (user.registered) {
              this.router.navigate(['/user']);
            }
            return registerSuccess({ user })
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '注册失败' } })))
        )
      )
    )
  );

  registerTempUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerTempUser),
      switchMap(action =>
        this.userService.registerTempUser(action.user).pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            if (user.registered) {
              this.router.navigate(['/user']);
            }
            return registerTempUserSuccess({ user });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '注册临时用户失败' } })))
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfile),
      switchMap(action =>
        this.userService.updateProfile(action.user).pipe(
          map((user: User) => updateProfileSuccess({ user })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '更新账户信息失败' } })))
        )
      )
    )
  );

  private saveUserToLocalstorage(user) {
    localStorage.setItem('userId', user.id);
  }

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private router: Router
  ) {
  }
}
