import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBook from './book.reducer';
import { RootState } from '@spend-book/core/store';

const selectBookState = createFeatureSelector<RootState, fromBook.State>(
  fromBook.bookFeatureKey
);

// export const selectBookState = createSelector(
//   selectSpendBookState,
//   state => state.book
// );

export const selectBook = createSelector(
  selectBookState,
  (state: fromBook.State) => state.book
);
