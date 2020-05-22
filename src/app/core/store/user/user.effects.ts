import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { login, logout } from './user.actions';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private router: Router
  ) {}

  login = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.router.navigate(['']);
        })
      ),
    { dispatch: false }
  );
}
