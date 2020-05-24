import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@spend-book/core/model/user';
import { FullDate } from '@spend-book/shared/model/helper-models';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  readonly userRoute = `${environment.server}/user`;

  constructor(private http: HttpClient) {
  }

  getUserById(userId: string) {
    return <Observable<User>>this.http.get(`${this.userRoute}/${userId}`);
  }

  login(email: string, password: string) {
    return <Observable<User>>this.http.get(`${this.userRoute}`, { params: { email, password } })
    .pipe(
      map((u: any) => u[0])
    );
  }

  register(user: Partial<User>, password: string) {
    return <Observable<User>>this.http.patch(`${this.userRoute}/${user.id}`, {
      ...user,
      password,
      registered: true,
      registeredDate: dayjs().format(FullDate)
    })
    // .pipe(
    //   map((u: any) => u[0])
    // );
  }

  registerTempUser(user: Partial<User>) {
    return <Observable<User>>this.http.post(`${this.userRoute}`, {
      ...user,
      registeredDate: dayjs().format(FullDate)
    })
    // .pipe(
    //   map((u: any) => u[0])
    // );
  }

  updateProfile(user: Partial<User>) {
    return <Observable<User>>this.http.patch(`${this.userRoute}/${user.id}`, user)
    // .pipe(
    //   map((u: any) => u.user)
    // );
  }
}
