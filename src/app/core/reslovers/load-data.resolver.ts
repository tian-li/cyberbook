import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { loadCategoriesByUser } from '@cyberbook/core/store/category';
import { loadSubscriptionsByUser } from '@cyberbook/core/store/subscription';
import { loadTransactionsByUser } from '@cyberbook/core/store/transaction';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import JwtDecode from 'jwt-decode';
import { getLocalStorageValueByKey } from '../../shared/utils/get-localstorage-value-by-key';
import { notifyWithSnackBar } from '../store/notification';
import { logout } from '../store/user';

@Injectable()
export class LoadDataResolver implements Resolve<any> {

  constructor(private store: Store) {
  }

  resolve() {
    const token: string = getLocalStorageValueByKey('jwt_token')!;
    if (!!token) {
      let decoded: any;

      try {
        decoded = JwtDecode(token);
      } catch (e) {
        this.store.dispatch(logout());
        return;
      }

      const isTokenValid: boolean = dayjs(decoded.exp * 1000).isAfter(dayjs());

      if (isTokenValid) {
        this.store.dispatch(loadTransactionsByUser());
        this.store.dispatch(loadCategoriesByUser());
        this.store.dispatch(loadSubscriptionsByUser());
      } else {
        this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '登录信息已过期，请重新登录', level: 'warn' } }));
        this.store.dispatch(logout());
      }
    }
  }
}
