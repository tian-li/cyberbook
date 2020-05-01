import { createAction, props } from '@ngrx/store';
import { Book } from '../../model/book';

export const loadBook = createAction('[Book] Load Book', props<{id: string}>());

export const loadBookSuccess = createAction('[Book] Load Book Success', props<{book: Book}>());
