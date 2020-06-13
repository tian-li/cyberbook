import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromUser } from '@spend-book/core/store';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { filter } from 'rxjs/operators';

@Injectable()
export class LoadDataResolver implements Resolve<any> {
  constructor(private store: Store) {
  }

  resolve() {
    this.store.pipe(
      select(fromUser.selectUser),
      filter(user => !!user.id),
    ).subscribe((user) => {
      this.store.dispatch(loadTransactionsByUser({ userId: user.id })),
        this.store.dispatch(loadCategoriesByUser({ userId: user.id }))
    })
  }
}
