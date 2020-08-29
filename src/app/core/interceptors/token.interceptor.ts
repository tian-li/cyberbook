import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-local-storage';
// import { getTokenFromLocalStorage } from '@spend-book/shared/utils/get-token-from-localstorage';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly permittedPaths: string[] = [
    '/users/login/',
    '/users/registerTempUser/',
    // '/users/register/',
  ]

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localToken = getTokenFromLocalStorage();

    // if(request.url.includes())

    // console.log("request ", request)

   const skipToken = this.permittedPaths.some((path: string) => {
      return `${request.url}/`.includes(path)
    });



    if(!skipToken) {
  // console.log("should add token", localToken)
  // console.log("request.url ", request.url)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`
        }
      });
    }

    return next.handle(request);
  }
}
