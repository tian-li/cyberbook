import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { notifyWithSnackBar } from '../../../core/store/notification/notification.actions';
import * as fromSpendBook from '../../store';
import { addCategorySuccess } from '../../store/category/category.actions';
// import * as fromCategory from '../../store/category/category.reducers';

import * as fromRoot from '../../../reducers'
import { addTransactionSuccess } from '../../store/transaction/transaction.actions';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(addCategorySuccess({category: {id: 1, bookId: 1, icon: '', name: 'name'}}))
    this.store.dispatch(addTransactionSuccess({transaction: {id: 1, bookId: 1, categoryId: 1, dateCreated: '123', dateModified: 'asd', description: 'asd', subCategoryId: 123}}))

    this.store.pipe(
      // select(fromSpendBook.selectBook),
      select(fromSpendBook.selectAllTransactions)
    ).subscribe((book) => {
      console.log('book', book);
    })
    //
    // this.store.pipe(
    //   // select(fromSpendBook.selectBook),
    //   select(fromRoot.selectIsAuthenticated)
    // ).subscribe((selectIsAuthenticated) => {
    //   console.log('selectIsAuthenticated', selectIsAuthenticated);
    // })
  }

  notify() {
    this.store.dispatch(notifyWithSnackBar({snackBar: {message: 'this is a snack bar'}}))
  }

}
