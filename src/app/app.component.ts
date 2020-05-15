import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCategoriesByBook } from '@spend-book/core/store/category';
import { loadTransactionsByBook } from '@spend-book/core/store/transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.dispatch(loadTransactionsByBook({ bookId: 1 }));
    this.store.dispatch(loadCategoriesByBook({ bookId: 1 }));
  }
}
