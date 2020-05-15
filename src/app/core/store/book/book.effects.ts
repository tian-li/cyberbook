import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { notifyWithSnackBar } from '../notification/notification.actions';

import { Book } from '../../model/book';
import { BookService } from '../../services/book.service';
import { loadBook, loadBookSuccess } from './book.actions';

@Injectable()
export class BookEffects {

  loadBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBook),
      switchMap(action =>
        this.bookService.loadBook(action.id).pipe(
          map((book: Book) => loadBookSuccess({ book })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '账本载入失败，请稍后重试' } })))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private bookService: BookService
  ) {
  }
}
