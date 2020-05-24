import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { UserService } from '@spend-book/core/services/user.service';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { loadUserFromLocalStorage, registerTempUser } from '@spend-book/core/store/user';
import { getUserIdFromLocalStorage } from '@spend-book/shared/utils/get-user-from-localstorage';
import { Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

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
    const id: string = uuid();

    const tempUser: Partial<User> = {
      id,
      username: '新用户' + id.substring(0, 4),
      registered: false
    }

    this.store.dispatch(registerTempUser({ user: tempUser }));
  }

  loadUserData(localUserId) {
    this.store.dispatch(loadUserFromLocalStorage({ userId: localUserId }));
    this.store.dispatch(loadTransactionsByUser({ userId: localUserId }));
    this.store.dispatch(loadCategoriesByUser({ userId: localUserId }));
  }
}
