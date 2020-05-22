import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { defaultSnackBarAction, defaultSnackBarDuration } from '../../../shared/model/snack-bar';
import { notifyWithSnackBar } from './notification.actions';

@Injectable()
export class NotificationEffects {

  notifyWithSnackBar$ = createEffect(() =>
      this.actions$.pipe(
        ofType(notifyWithSnackBar),
        tap(action =>
          this.snackBar.open(
            action.snackBar.message,
            action.snackBar.action ? action.snackBar.action : defaultSnackBarAction,
            {
              duration: action.snackBar.duration ? action.snackBar.duration : defaultSnackBarDuration,
            }
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar
  ) {
  }
}
