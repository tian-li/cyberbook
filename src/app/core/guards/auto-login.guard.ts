import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { loginWithLocalToken, registerTempUser } from '@cyberbook/core/store/user';
import { createTempUser } from '@cyberbook/shared/utils/create-temp-user';
import { getLocalStorageValueByKey } from '@cyberbook/shared/utils/get-localstorage-value-by-key';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Injectable()
export class AutoLoginGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // skip auto login when going to login page
    if (state.url === '/user/login' || state.url === '/user/register') {
      return of(true);
    }

    const localUserId = getLocalStorageValueByKey('userId');
    if (!!localUserId) {
      this.store.dispatch(loginWithLocalToken());
    } else {
      this.store.dispatch(registerTempUser({ user: createTempUser() }));
    }
    return of(true);
  }
}
