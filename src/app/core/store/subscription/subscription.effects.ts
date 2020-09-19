import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification/notification.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Subscription } from '../../model/subscription';
import { SubscriptionService } from '../../services/subscription.service';
import {
  addSubscription,
  addSubscriptionSuccess,
  loadSubscriptionsByUser,
  loadSubscriptionsByUserSuccess,
  removeSubscription,
  removeSubscriptionSuccess,
  stopSubscription,
  stopSubscriptionSuccess,
  updateSubscription,
  updateSubscriptionSuccess
} from './subscription.actions';

@Injectable()
export class SubscriptionEffects {

  loadSubscriptionsByBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSubscriptionsByUser),
      switchMap(() =>
        this.subscriptionService.loadSubscriptionsByUser().pipe(
          map((subscriptions: Subscription[]) => loadSubscriptionsByUserSuccess({ subscriptions })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '账本记录载入失败，请稍后重试' } })))
        ))
    )
  );

  addSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSubscription),
      mergeMap(action =>
        this.subscriptionService.addSubscription(action.subscription).pipe(
          map((subscription: Subscription) => {
            // this.closeSubscriptionEditor();
            return addSubscriptionSuccess({ subscription });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '记账失败，请稍后重试' } })))
        ))
    )
  );

  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSubscription),
      mergeMap(action =>
        this.subscriptionService.updateSubscription(action.update).pipe(
          map((subscription: Subscription) => {
            // this.closeSubscriptionEditor();
            return updateSubscriptionSuccess({ update: { id: subscription.id, changes: subscription } });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑失败，请稍后重试' } })))
        ))
    )
  );

  stopSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stopSubscription),
      mergeMap(action =>
        this.subscriptionService.stopSubscription(action.id).pipe(
          switchMap((subscription: Subscription) => {
            // this.closeSubscriptionEditor();
            return [
              stopSubscriptionSuccess({ update: { id: subscription.id, changes: subscription } }),
              notifyWithSnackBar({ snackBar: { message: '周期性账目已取消' } })
            ];
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑失败，请稍后重试' } })))
        ))
    )
  );

  removeSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeSubscription),
      mergeMap(action =>
        this.subscriptionService.removeSubscription(action.id).pipe(
          map(() => {
            // this.closeSubscriptionEditor();
            return removeSubscriptionSuccess();
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '删除失败，请稍后重试' } })))
        ))
    )
  );

  closeSubscriptionEditor() {
    // const subscriptionEditor = this.matDialog.getDialogById(subscriptionEditorDialogId);
    // if !(!subscriptionEditor) {
    //   subscriptionEditor.close();
    // }
  }

  constructor(
    private actions$: Actions,
    private subscriptionService: SubscriptionService,
    private matDialog: MatDialog
  ) {
  }
}
