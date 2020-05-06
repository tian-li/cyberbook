import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Transaction } from '../../model/transaction';
import { addTransactionSuccess, loadTransactionsByBookSuccess, removeTransaction, updateTransactionSuccess } from './transaction.actions';

export const transactionFeatureKey = 'transaction';

export interface State extends EntityState<Transaction> {
  selectedTransactionId: number;
}

export const adapter: EntityAdapter<Transaction> = createEntityAdapter<Transaction>({
  selectId: (transaction: Transaction) => transaction.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedTransactionId: null,
});

const reducer = createReducer(
  initialState,
  on(loadTransactionsByBookSuccess, (state, { transactions }) =>
    adapter.addMany(transactions, { ...state, selectedTransactionId: null })
  ),
  on(addTransactionSuccess, (state, { transaction }) =>
    adapter.addOne(transaction, { ...state, selectedTransactionId: transaction.id })
  ),
  on(updateTransactionSuccess, (state, { update }) =>
    adapter.updateOne(update, { ...state, selectedTransactionId: update.id })
  ),
  on(removeTransaction, (state, { id }) =>
    adapter.removeOne(id, { ...state, selectedTransactionId: null })
  ),
);

export function transactionReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const getSelectedTransactionId = (state: State) => state.selectedTransactionId;
//
// export const {
//   selectIds: selectTransactionIds,
//   selectEntities: selectTransactionEntities,
//   selectAll: selectAllTransactions,
//   selectTotal: selectTransactionTotal,
// } = adapter.getSelectors();
