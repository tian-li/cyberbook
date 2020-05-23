import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { UserService } from '@spend-book/core/services/user.service';
import { loadCategoriesByUser } from '@spend-book/core/store/category';
import { loadTransactionsByUser } from '@spend-book/core/store/transaction';
import { loadUserFromLocalStorage, registerTempUser } from '@spend-book/core/store/user';
import { Observable } from 'rxjs';

import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<User> {
  constructor(private userService: UserService, private store: Store) {
  }

  resolve(
    // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const localUserId = this.userService.getUserIdFromLocalStorage();

    console.log('userId in resolver', localUserId)

    if (!!localUserId) {
      this.loadUserData(localUserId);
    } else {
      this.registerTempUser();
    }
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
    // console.log('localUserId in resolver', localUserId)
    this.store.dispatch(loadUserFromLocalStorage({ userId: localUserId }));
    this.store.dispatch(loadTransactionsByUser({ userId: localUserId }));
    this.store.dispatch(loadCategoriesByUser({ userId: localUserId }));
  }
}
