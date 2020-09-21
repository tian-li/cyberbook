import { logout } from '@cyberbook/core/store/user/user.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Transaction } from '../../model/transaction';
import {
  addTransactionSuccess,
  loadTransactionsByUserSuccess,
  removeTransaction,
  updateTransactionSuccess
} from './transaction.actions';

export const transactionFeatureKey = 'transaction';

export interface State extends EntityState<Transaction> {
  selectedTransactionId: number;
  transactionIdsByDate: { [date: string]: number[] };
}

export const adapter: EntityAdapter<Transaction> = createEntityAdapter<Transaction>({
  selectId: (transaction: Transaction) => transaction.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedTransactionId: null,
  transactionIdsByDate: {},
});

const reducer = createReducer(
  initialState,
  on(loadTransactionsByUserSuccess, (state, { transactions }) => {
    let transactionIdsByDate = {};
    transactions.forEach((transaction: Transaction) => {
      const date = transaction.transactionDate.substring(0, 10);
      transactionIdsByDate = {
        ...transactionIdsByDate,
        [date]: transactionIdsByDate[date] ? [...transactionIdsByDate[date], transaction.id] : [transaction.id]
      };
    });

    return adapter.setAll(transactions, { ...state, selectedTransactionId: null, transactionIdsByDate });
  }),
  on(addTransactionSuccess, (state, { transaction }) => {
    const date = transaction.transactionDate.substring(0, 10);
    const updatedTransactionIdsByDate = {
      ...state.transactionIdsByDate,
      [date]: state.transactionIdsByDate[date] ?
        [...state.transactionIdsByDate[date], transaction.id] : [transaction.id]
    };
    return adapter.addOne(transaction, {
      ...state,
      selectedTransactionId: transaction.id,
      transactionIdsByDate: updatedTransactionIdsByDate
    });
  }),
  on(updateTransactionSuccess, (state, { update }) => {
    const updatedTransaction = update.changes;
    const oldTransaction = state.entities[update.id];

    if (updatedTransaction.transactionDate !== oldTransaction.transactionDate) {
      const newDate = updatedTransaction.transactionDate.substring(0, 10);
      const oldDate = oldTransaction.transactionDate.substring(0, 10);

      const updatedTransactionIdsByDate = {
        ...state.transactionIdsByDate,
        [oldDate]: state.transactionIdsByDate[oldDate].filter(id => id !== update.id),
        [newDate]: state.transactionIdsByDate[newDate] ?
          [...state.transactionIdsByDate[newDate], update.id] : [update.id]
      };

      return adapter.updateOne(update, {
        ...state,
        selectedTransactionId: update.id,
        transactionIdsByDate: updatedTransactionIdsByDate
      });
    }
    return adapter.updateOne(update, { ...state, selectedTransactionId: update.id });
  }),
  on(removeTransaction, (state, { id }) => {
    const date = state.entities[id].transactionDate.substring(0, 10);

    const updatedTransactionIdsByDate = {
      ...state.transactionIdsByDate,
      [date]: state.transactionIdsByDate[date].filter(transactionId => transactionId !== id),
    };
    return adapter.removeOne(id, {
      ...state,
      selectedTransactionId: null,
      transactionIdsByDate: updatedTransactionIdsByDate
    });
  }),
  on(logout, (state) => initialState),
);

export function transactionReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
