import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Transaction } from '../../model/transaction';

export const loadTransactionsByBook = createAction(
  '[Transaction] Load Transactions by Book',
  props<{ bookId: number }>()
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
  props<{ transaction: Transaction }>()
);

export const updateTransaction = createAction(
  '[Transaction] Update Transaction',
  props<{ transaction: Partial<Transaction> }>()
);

export const updateTransactionSuccess = createAction(
  '[Transaction] Update Transaction Success',
  props<{ update: Update<Transaction> }>()
);

export const removeTransaction = createAction('[Transaction] Remove Transaction', props<{ id: number }>());

export const removeTransactionSuccess = createAction('[Transaction] Remove Transaction Success');
