import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-local-storage';
// import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-localstorage';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly permittedPaths: string[] = [
    '/users/login/',
    '/users/register-temp-user/',
    '/users/register/',
  ]

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localToken = getTokenFromLocalStorage();

    const skipToken = this.permittedPaths.some((path: string) => {
      return `${request.url}/`.includes(path)
    });


    if (!skipToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`
        }
      });
    }

    return next.handle(request).pipe(
      delay(300),
      catchError(e => {
        return throwError("error")
      })
    )
  }
}
