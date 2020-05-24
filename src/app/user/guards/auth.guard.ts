import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromUser } from '@spend-book/core/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private store: Store
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(fromUser.selectUser),
      switchMap(user => {
        console.log('user', user);
        if(user.registered) {
          return of(false)
        } else {
          return of(true)
        }
      })
    )
  }
}
