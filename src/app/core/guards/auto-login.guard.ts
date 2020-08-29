import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginWithLocalToken, registerTempUser } from '@spend-book/core/store/user';
import { createTempUser } from '@spend-book/shared/utils/create-temp-user';
import { getUserIdFromLocalStorage } from '@spend-book/shared/utils/get-user-from-localstorage';
import { Observable, of } from 'rxjs';

@Injectable()
export class AutoLoginGuard implements CanActivate {
  constructor(private store: Store) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("route", route);
    console.log("state", state);

    // skip auto login when going to login page
    if(state.url === '/user/authenticate') {
      return of(true);
    }


    const localUserId = getUserIdFromLocalStorage();
    if (!!localUserId) {
      this.store.dispatch(loginWithLocalToken());
    } else {
      this.store.dispatch(registerTempUser({ user: createTempUser() }));
    }
    return of(true);
  }
}
