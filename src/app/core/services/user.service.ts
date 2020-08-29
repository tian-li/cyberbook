import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@spend-book/core/model/cyberbook-server-response';
import { User } from '@spend-book/core/model/user';
import { FullDate } from '@spend-book/shared/model/helper-models';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  readonly userRoute = `${environment.server}/users`;

  constructor(private http: HttpClient) {
  }

  loginWithToken(): Observable<User> {
    return <Observable<User>>this.http.post(`${this.userRoute}/loginWithToken`, {});
  }

  login(email: string, password: string): Observable<User> {
    return <Observable<User>>this.http.post(`${this.userRoute}/login`, { email, password }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  register(user: Partial<User>, password: string): Observable<User> {
    return <Observable<User>>this.http.post(`${this.userRoute}/register`, {
      ...user,
      password,
      // registered: true,
      // registeredDate: dayjs().format(FullDate)
    }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  registerTempUser(): Observable<User> {
    // console.log('registerTempUser', `${this.userRoute}/`)
    // return <Observable<User>>this.http.post(`${this.userRoute}/registerTempUser`, {
    //   ...user,
    //   registeredDate: dayjs().format(FullDate)
    // });
    return <Observable<User>>this.http.post(`${this.userRoute}/registerTempUser`, {}).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  // saveTempUser(user: Partial<User>, password: string): Observable<User> {
  //   return <Observable<User>>this.http.put(`${this.userRoute}/${user.id}`, {
  //     ...user,
  //     password,
  //     // registered: true,
  //     // registeredDate: dayjs().format(FullDate)
  //   });
  // }

  updateProfile(user: Partial<User>): Observable<User> {
    return <Observable<User>>this.http.put(`${this.userRoute}/${user.id}`, user);
  }
}
