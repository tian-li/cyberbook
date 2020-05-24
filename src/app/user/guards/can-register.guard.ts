import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '@spend-book/core/services/user.service';
import { getUserIdFromLocalStorage } from '@spend-book/shared/utils/get-user-from-localstorage';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CanRegisterGuard implements CanActivate {
  constructor(private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userId: null | string = getUserIdFromLocalStorage();

    if (!userId) {
      return of(true);
    }

    return this.userService.getUserById(userId).pipe(
      switchMap(user => {
        if (user.registered) {
          return of(false)
        } else {
          return of(true)
        }
      })
    )
  }
}
