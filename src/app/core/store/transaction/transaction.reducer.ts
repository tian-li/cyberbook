import { logout } from '@cyberbook/core/store/user/user.actions';
import { FullDate } from '@cyberbook/shared/model/helper-models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as dayjs from 'dayjs';

import { Transaction } from '../../model/transaction';
import {
  addTransactionSuccess,
  loadTransactionsByUserSuccess,
  removeTransaction,
  updateTransactionSuccess
} from './transaction.actions';

export const transactionFeatureKey = 'transaction';

export interface State extends EntityState<Transaction> {
  selectedTransactionId: number | string | null;
  transactionIdsByDate: { [date: string]: (number | string)[] };
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
    let transactionIdsByDate: any = {};
    transactions.forEach((transaction: Transaction) => {
      const date = dayjs(transaction.transactionDate).format(FullDate);
      transactionIdsByDate = {
        ...transactionIdsByDate,
        [date]: transactionIdsByDate[date] ? [...transactionIdsByDate[date], transaction.id] : [transaction.id]
      };
    });

    return adapter.setAll(transactions, { ...state, selectedTransactionId: null, transactionIdsByDate });
  }),
  on(addTransactionSuccess, (state, { transaction }) => {
    const date = dayjs(transaction.transactionDate).format(FullDate);
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
    const oldTransaction = state.entities[update.id]!;

    if (updatedTransaction.transactionDate !== oldTransaction.transactionDate) {
      const newDate = dayjs(updatedTransaction.transactionDate).format(FullDate);
      const oldDate = dayjs(oldTransaction.transactionDate).format(FullDate);

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
    const date = dayjs(state.entities[id]!.transactionDate).format(FullDate);

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
