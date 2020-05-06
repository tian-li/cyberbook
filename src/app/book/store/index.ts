import { Dictionary } from '@ngrx/entity';
import { Action, combineReducers, createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { Category } from '../model/category';
import { Transaction } from '../model/transaction';
import { TransactionVO } from '../model/transactionVO';
import * as fromBook from './book/book.reducers';
import * as fromCategory from './category/category.reducers';
import * as fromTransaction from './transaction/transaction.reducers';

export const spendBookFeatureKey = 'spend-book';

export interface BooksState {
  [fromBook.bookFeatureKey]: fromBook.State;
  [fromCategory.categoryFeatureKey]: fromCategory.State;
  [fromTransaction.transactionFeatureKey]: fromTransaction.State;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: BooksState | undefined, action: Action) {
  return combineReducers({
    [fromBook.bookFeatureKey]: fromBook.bookReducer,
    [fromCategory.categoryFeatureKey]: fromCategory.categoryReducer,
    [fromTransaction.transactionFeatureKey]: fromTransaction.transactionReducer,
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
} = fromCategory.adapter.getSelectors(selectCategoryEntitiesState);

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
} = fromTransaction.adapter.getSelectors(selectTransactionEntitiesState);


export const selectAllTransactionsVO = createSelector(
  selectCategoryEntities,
  selectAllTransactions,
  (categories: Dictionary<Category>, transactions: Transaction[]) => {
    if (Object.keys(categories).length <= 0 || transactions.length <= 0) {
      return [];
    }
    return transactions.map(transaction => {
      return {
        ...transaction,
        description: transaction.description ? transaction.description : categories[transaction.categoryId].name,
        icon: categories[transaction.categoryId].icon
      }
    })
  }
)