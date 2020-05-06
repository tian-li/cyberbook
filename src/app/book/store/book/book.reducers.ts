import { Action, createReducer, on } from '@ngrx/store';
import { Book } from '../../model/book';
import { loadBookSuccess } from './book.actions';

export const bookFeatureKey = 'book';

export interface State {
  book: Book;
}

export const initialState: State = {
  book: { id: 1, dateCreated: '2020-01-01', name: 'test book' }
};

const reducer = createReducer(
  initialState,
  on(loadBookSuccess, (state, { book }) => ({ ...state, book }))
);

export function bookReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const selectBook = (state: State) => state.book;
