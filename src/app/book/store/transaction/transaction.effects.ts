import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { notifyWithSnackBar } from '../../../core/store/notification/notification.actions';

import { Transaction } from '../../model/transaction';
import { TransactionService } from '../../services/transaction.service';
import {
  addTransaction,
  addTransactionSuccess,
  loadTransactionsByBook,
  loadTransactionsByBookSuccess,
  removeTransaction,
  removeTransactionSuccess,
  updateTransaction,
  updateTransactionSuccess
} from './transaction.actions';

@Injectable()
export class TransactionEffects {

  loadTransactionsByBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactionsByBook),
      switchMap(action =>
        this.transactionService.loadTransactionsByBook(action.bookId).pipe(
          map((transactions: Transaction[]) => loadTransactionsByBookSuccess({ transactions })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '账本记录载入失败，请稍后重试' } })))
        ))
    )
  );

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      mergeMap(action =>
        this.transactionService.addTransaction(action.transaction).pipe(
          map((transaction: Transaction) => addTransactionSuccess({ transaction })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '记账失败，请稍后重试' } })))
        ))
    )
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransaction),
      mergeMap(action =>
        this.transactionService.updateTransaction(action.transaction).pipe(
          map((transaction: Transaction) => updateTransactionSuccess({ transaction })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑失败，请稍后重试' } })))
        ))
    )
  );

  removeTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeTransaction),
      mergeMap(action =>
        this.transactionService.removeTransaction(action.id).pipe(
          map(() => removeTransactionSuccess()),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '删除失败，请稍后重试' } })))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private transactionService: TransactionService
  ) {
  }
}
