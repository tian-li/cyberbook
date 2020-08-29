import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { User } from '@spend-book/core/model/user';
import { UserService } from '@spend-book/core/services/user.service';
import { addDefaultCategoriesToUser } from '@spend-book/core/store/category';
import { notifyWithSnackBar } from '@spend-book/core/store/notification';
import { createTempUser } from '@spend-book/shared/utils/create-temp-user';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  loginWithLocalToken,
  loginWithLocalTokenSuccess,
  login,
  loginSuccess,
  logout,
  register,
  registerSuccess,
  registerTempUser,
  registerTempUserSuccess,
  saveTempUser,
  saveTempUserSuccess,
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
      ofType(loginWithLocalToken),
      switchMap(() =>
        this.userService.loginWithToken().pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            return loginWithLocalTokenSuccess({ user });

          }),
          catchError((error: HttpErrorResponse) => {
            // if (error.status === 404) {
            //   return of(
            //     notifyWithSnackBar({ snackBar: { message: '本地用户不存在，创建新临时用户' } }),
            //     registerTempUser({ user: createTempUser() })
            //   )
            // } else {
              return of(notifyWithSnackBar({ snackBar: { message: '登录信息已过期，请重新登录' } }))
            // }
          })
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
        this.userService.registerTempUser().pipe(
          map((user: User) => {
            this.saveUserToLocalstorage(user);
            // if (user.registered) {
              this.router.navigate(['/user']);
            // }
            return registerTempUserSuccess({ user });
            // return [
            //   registerTempUserSuccess({ user }),
            //   // addDefaultCategoriesToUser({ userId: user.id })
            // ];
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '注册临时用户失败' } })))
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
          switchMap((user: User) => {
            this.saveUserToLocalstorage(user);
            this.router.navigate(['/user']);
            return [
              notifyWithSnackBar({ snackBar: { message: '更新成功' } }),
              updateProfileSuccess({ user }),
            ];
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '更新账户信息失败' } })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(logout),
        map(action => localStorage.clear())
      ),
    { dispatch: false }
  )

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
