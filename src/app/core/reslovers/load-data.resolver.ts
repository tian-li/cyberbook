import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromUser } from '@spend-book/core/store';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadSubscriptionsByUser } from '@spend-book/core/store/subscription';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { filter } from 'rxjs/operators';

@Injectable()
export class LoadDataResolver implements Resolve<any> {

  constructor(private store: Store ) {
    console.log("    LoadDataResolver")
  }

  resolve() {
    // if()
    this.store.dispatch(loadTransactionsByUser());
    this.store.dispatch(loadCategoriesByUser())
    this.store.dispatch(loadSubscriptionsByUser())
  }
}
