import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-local-storage';
// import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-localstorage';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly permittedPaths: string[] = [
    '/users/login/',
    '/users/register-temp-user/',
    '/users/register/',
  ]

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localToken = getTokenFromLocalStorage();

    // if(request.url.includes())

    // console.log("request ", request)

    const skipToken = this.permittedPaths.some((path: string) => {
      return `${request.url}/`.includes(path)
    });


    if (!skipToken) {
      // console.log("should add token", localToken)
      // console.log("request.url ", request.url)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`
        }
      });
    }

    return next.handle(request).pipe(
      map(res => {
        console.log("res interceptor", res);
        return res;
      }),
      catchError(e => {
        console.log('error in interceptor', e);
        return throwError("error")
      })
    )
  }
}
