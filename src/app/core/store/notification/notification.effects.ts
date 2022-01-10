import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, tap } from 'rxjs/operators';

import { defaultSnackBarAction, defaultSnackBarDuration, LevelPrefix } from '../../../shared/model/snack-bar';
import { notifyWithSnackBar } from './notification.actions';

@Injectable()
export class NotificationEffects {

  notifyWithSnackBar$ = createEffect(() =>
      this.actions$.pipe(
        ofType(notifyWithSnackBar),
        debounceTime(200),
        tap(action => {
            let message = action.snackBar.message!;

            if (action.snackBar.prefixIcon !== undefined) {
              message = `${action.snackBar.prefixIcon} ${message}`;
            } else if (action.snackBar.level !== undefined) {
              message = `${LevelPrefix[action.snackBar.level]} ${message}`;
            }

            this.snackBar.open(
              message,
              action.snackBar.action ? action.snackBar.action : defaultSnackBarAction,
              {
                duration: action.snackBar.duration ? action.snackBar.duration : defaultSnackBarDuration,
              }
            );
          }
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
