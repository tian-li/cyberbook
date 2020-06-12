import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { UserService } from '@spend-book/core/services/user.service';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { loadUserFromLocalStorage, registerTempUser } from '@spend-book/core/store/user';
import { createTempUser } from '@spend-book/shared/utils/create-temp-user';
import { getUserIdFromLocalStorage } from '@spend-book/shared/utils/get-user-from-localstorage';
import { Observable, of } from 'rxjs';

@Injectable()
export class AutoLoginGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const localUserId = getUserIdFromLocalStorage();
    if (!!localUserId) {
      this.loadUserData(localUserId);
    } else {
      this.registerTempUser();
    }
    return of(true);
  }

  registerTempUser() {
    this.store.dispatch(registerTempUser({ user: createTempUser() }));
  }

  loadUserData(localUserId) {
    this.store.dispatch(loadUserFromLocalStorage({ userId: localUserId }));
    this.store.dispatch(loadTransactionsByUser({ userId: localUserId }));
    this.store.dispatch(loadCategoriesByUser({ userId: localUserId }));
  }
}
