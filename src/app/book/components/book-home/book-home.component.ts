import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { notifyWithSnackBar } from '../../../core/store/notification/notification.actions';
import { loadCategoriesByBook } from '../../store/category/category.actions';
import { loadTransactionsByBook } from '../../store/transaction/transaction.actions';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit {

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(loadTransactionsByBook({ bookId: 1 }))
    this.store.dispatch(loadCategoriesByBook({ bookId: 1 }))

  }

  notify() {
    this.store.dispatch(notifyWithSnackBar({ snackBar: { message: 'this is a snack bar' } }))
  }

}
