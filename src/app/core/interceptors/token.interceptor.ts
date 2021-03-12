import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { hideLoadingSpinner } from '@cyberbook/core/store/ui';
import { logout } from '@cyberbook/core/store/user';
import { getLocalStorageValueByKey } from '@cyberbook/shared/utils/get-localstorage-value-by-key';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly permittedPaths: string[] = [
    '/users/login/',
    '/users/register-temp-user/',
    '/users/register/',
  ];

  constructor(private store: Store) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localToken = getLocalStorageValueByKey('jwt_token');

    const skipToken: boolean = this.permittedPaths.some((path: string) => {
      return `${request.url}/`.includes(path);
    });

    const isBackendAPI: boolean = request.url.includes(environment.server);

    if (!skipToken && isBackendAPI) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '无权操作',level: 'error' } }));
            break;
          case 403:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '登录信息已过期，请重新登录', level: 'warn' } }));
            this.store.dispatch(logout());
            break;
          case 404:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '404：找不到资源', level: 'error' } }));
            break;
          case 422:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '账号密码错误', level: 'error' } }));
            break;
          case 500:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '服务器发生错误，请稍后重试', level: 'error' } }));
            break;
          default:
            this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '发生未知错误，请稍后重试', level: 'error' } }));
            break;
        }
        this.store.dispatch(hideLoadingSpinner());
        return throwError(error);
      })
    );
  }
}
