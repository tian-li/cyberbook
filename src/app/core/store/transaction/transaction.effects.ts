import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { notifyWithSnackBar } from '@spend-book/core/store/notification/notification.actions';
import { transactionEditorDialogId } from '@spend-book/shared/constants';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Transaction } from '../../model/transaction';
import { TransactionService } from '../../services/transaction.service';
import {
  addTransaction,
  addTransactionSuccess,
  loadTransactionsByUser,
  loadTransactionsByUserSuccess,
  removeTransaction,
  removeTransactionSuccess,
  updateTransaction,
  updateTransactionSuccess
} from './transaction.actions';

@Injectable()
export class TransactionEffects {

  loadTransactionsByBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactionsByUser),
      switchMap(() =>
        this.transactionService.loadTransactionsByUser().pipe(
          map((transactions: Transaction[]) => loadTransactionsByUserSuccess({ transactions })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '账本记录载入失败，请稍后重试' } })))
        ))
    )
  );

  addTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransaction),
      mergeMap(action =>
        this.transactionService.addTransaction(action.transaction).pipe(
          map((transaction: Transaction) => {
            this.closeTransactionEditor();
            return addTransactionSuccess({ transaction });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '记账失败，请稍后重试' } })))
        ))
    )
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransaction),
      mergeMap(action =>
        this.transactionService.updateTransaction(action.transaction).pipe(
          map((transaction: Transaction) => {
            this.closeTransactionEditor();
            return updateTransactionSuccess({ update: { id: transaction.id, changes: transaction } });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑失败，请稍后重试' } })))
        ))
    )
  );

  removeTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeTransaction),
      mergeMap(action =>
        this.transactionService.removeTransaction(action.id).pipe(
          map(() => {
            this.closeTransactionEditor();
            return removeTransactionSuccess();
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '删除失败，请稍后重试' } })))
        ))
    )
  );

  closeTransactionEditor() {
    const transactionEditor = this.matDialog.getDialogById(transactionEditorDialogId);
    if (!!transactionEditor) {
      transactionEditor.close();
    }
  }

  constructor(
    private actions$: Actions,
    private transactionService: TransactionService,
    private matDialog: MatDialog
  ) {
  }
}
