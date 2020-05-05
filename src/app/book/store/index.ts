import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromBook from './book/book.reducers';
import { adapter as categoryAdapter } from './category/category.reducers';
import * as fromCategory from './category/category.reducers';
import { adapter as transactionAdapter } from './transaction/transaction.reducers';
import * as fromTransaction from './transaction/transaction.reducers';

export const spendBookFeatureKey = 'spend-book';

export interface BooksState {
  book: fromBook.State;
  category: fromCategory.State;
  transaction: fromTransaction.State;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: BooksState | undefined, action: Action) {
  return combineReducers({
    book: fromBook.bookReducer,
    category: fromCategory.categoryReducer,
    transaction: fromTransaction.transactionReducer,
  })(state, action);
}

export interface State extends fromRoot.State {
  [spendBookFeatureKey]: BooksState;
}

export const selectSpendBookState = createFeatureSelector<State, BooksState>(spendBookFeatureKey);

// book
export const selectBookState = createSelector(
  selectSpendBookState,
  state => state.book
);

export const selectBook = createSelector(
  selectBookState,
  fromBook.selectBook
);

// category
export const selectCategoryEntitiesState = createSelector(
  selectSpendBookState,
  state => state.category
);

export const selectSelectedCategoryId = createSelector(
  selectCategoryEntitiesState,
  fromCategory.getSelectedCategoryId
);

export const {
  selectIds: selectCategoryIds,
  selectEntities: selectCategoryEntities,
  selectAll: selectAllCategories,
  selectTotal: selectCategoryTotal,
} = categoryAdapter.getSelectors();

// transaction
export const selectTransactionEntitiesState = createSelector(
  selectSpendBookState,
  state => state.transaction
);

export const selectSelectedTransactionId = createSelector(
  selectTransactionEntitiesState,
  fromTransaction.getSelectedTransactionId
);

export const {
  selectIds: selectTransactionIds,
  selectEntities: selectTransactionEntities,
  selectAll: selectAllTransactions,
  selectTotal: selectTransactionTotal,
} = transactionAdapter.getSelectors();
