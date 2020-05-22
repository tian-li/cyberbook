import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.dispatch(loadTransactionsByUser({ userId: 'qwerty' }));
    this.store.dispatch(loadCategoriesByUser({ userId: 'qwerty' }));
  }
}
