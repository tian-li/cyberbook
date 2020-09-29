import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { transactionEditorDialogId } from '@cyberbook/shared/constants';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
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

  loadTransactionsByUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactionsByUser),
      switchMap(() =>
        this.transactionService.loadTransactionsByUser().pipe(
          map((transactions: Transaction[]) => loadTransactionsByUserSuccess({ transactions })),
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
