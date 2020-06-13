import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUserFromLocalStorage, registerTempUser } from '@spend-book/core/store/user';
import { createTempUser } from '@spend-book/shared/utils/create-temp-user';
import { getUserIdFromLocalStorage } from '@spend-book/shared/utils/get-user-from-localstorage';
import { Observable, of } from 'rxjs';

@Injectable()
export class AutoLoginGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(): Observable<boolean> {
    const localUserId = getUserIdFromLocalStorage();
    if (!!localUserId) {
      this.store.dispatch(loadUserFromLocalStorage({ userId: localUserId }));
    } else {
      this.store.dispatch(registerTempUser({ user: createTempUser() }));
    }
    return of(true);
  }
}
