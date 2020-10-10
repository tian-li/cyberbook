import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromUser } from '../../core/store';
import { AuthenticateComponent } from '../components/authenticate/authenticate.component';

@Injectable()
export class CanLeaveAuthGuard implements CanDeactivate<AuthenticateComponent> {
  constructor(private store: Store) {
  }

  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(fromUser.selectUser),
      map(user => !!user.id)
    );
  }

}
