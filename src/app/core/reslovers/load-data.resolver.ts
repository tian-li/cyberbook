import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadSubscriptionsByUser } from '@spend-book/core/store/subscription';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { getUserIdFromLocalStorage } from '../../shared/utils/get-user-from-localstorage';

@Injectable()
export class LoadDataResolver implements Resolve<any> {

  constructor(private store: Store) {
  }

  resolve() {
    const localUserId = getUserIdFromLocalStorage();
    if (!!localUserId) {
      this.store.dispatch(loadTransactionsByUser());
      this.store.dispatch(loadCategoriesByUser());
      this.store.dispatch(loadSubscriptionsByUser());
    }
  }
}
