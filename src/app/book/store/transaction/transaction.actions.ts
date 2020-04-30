import { createAction, props } from '@ngrx/store';

import { Transaction } from '../../model/transaction';

export const loadTransactionsByBook = createAction(
  '[Transaction] Load Transactions by Book',
  props<{ bookId: string }>()
);

export const loadTransactionsByBookSuccess = createAction(
  '[Transaction] Load Transactions by Book Success',
  props<{ transactions: Transaction[] }>()
);

export const addTransaction = createAction(
  '[Transaction] Add Transaction',
  props<{ transaction: Partial<Transaction> }>()
);

export const addTransactionSuccess = createAction(
  '[Transaction] Add Transaction Success',
  props<{ transaction: Partial<Transaction> }>()
);

export const updateTransaction = createAction(
  '[Transaction] Update Transaction',
  props<{ transaction: Partial<Transaction> }>()
);

export const updateTransactionSuccess = createAction(
  '[Transaction] Update Transaction Success',
  props<{ transaction: Partial<Transaction> }>()
);

export const removeTransaction = createAction('[Transaction] Remove Transaction', props<{ id: string }>());

export const removeTransactionSuccess = createAction('[Transaction] Remove Transaction Success');
