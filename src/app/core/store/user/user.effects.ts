import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { registeredDays, User } from '@cyberbook/core/model/user';
import { UserService } from '@cyberbook/core/services/user.service';
import { loadCategoriesByUser } from '@cyberbook/core/store/category';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { loadSubscriptionsByUser } from '@cyberbook/core/store/subscription';
import { loadTransactionsByUser } from '@cyberbook/core/store/transaction';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store/src/models';
import { of } from 'rxjs';
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
  savePreferredTheme,
  savePreferredThemeSuccess,
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
          switchMap((user: User) => {
            this.saveUserToLocalstorage(user);

            const actions: Action[] = [
              loginWithLocalTokenSuccess({ user }),
            ];

            if (!user.registered) {
              const daysRemaining = 7 - registeredDays(user);
              actions.push(notifyWithSnackBar({
                snackBar: {
                  message: `临时账户将于${daysRemaining}天后失效，请及时注册！`,
                  duration: 10000,
                  level: 'warn'
                }
              }));
            }

            return actions;
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
          switchMap((user: User) => {
            this.saveUserToLocalstorage(user);
            return [
              registerTempUserSuccess({ user }),
              notifyWithSnackBar({ snackBar: { message: '正在使用临时账户，请及时注册', level: 'warn' } }),
              loadTransactionsByUser(),
              loadCategoriesByUser(),
              loadSubscriptionsByUser()
            ];
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
            return of(updateProfileSuccess({ user }));
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
    localStorage.setItem('theme', user.theme);
  }

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private router: Router
  ) {
  }
}
