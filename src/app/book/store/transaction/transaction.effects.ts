import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

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

  loadTransactionsByBook$ = createEffect(() => this.actions$.pipe(
    ofType(loadTransactionsByBook),
    switchMap(({ bookId }) => this.transactionService.loadTransactionsByBook(bookId).pipe(
      map((transactions: Transaction[]) => loadTransactionsByBookSuccess({ transactions })),
      catchError(() => EMPTY)
    ))
    )
  );

  addTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(addTransaction),
    mergeMap(({ transaction }) => this.transactionService.addTransaction(transaction).pipe(
      map((transaction: Transaction) => addTransactionSuccess({ transaction })),
      catchError(() => EMPTY)
    ))
    )
  );

  updateTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTransaction),
    mergeMap(({ transaction }) => this.transactionService.updateTransaction(transaction).pipe(
      map((transaction: Transaction) => updateTransactionSuccess({ transaction })),
      catchError(() => EMPTY)
    ))
    )
  );

  removeTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(removeTransaction),
    mergeMap(({ id }) => this.transactionService.removeTransaction(id).pipe(
      map(() => removeTransactionSuccess()),
      catchError(() => EMPTY)
    ))
    )
  );

  constructor(
    private actions$: Actions,
    private transactionService: TransactionService
  ) {
  }
}
