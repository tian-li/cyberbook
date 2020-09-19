import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCategoriesByUser } from '@cyberbook/core/store/category';
import { loadSubscriptionsByUser } from '@cyberbook/core/store/subscription';
import { loadTransactionsByUser } from '@cyberbook/core/store/transaction';
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
