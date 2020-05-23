import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@spend-book/core/model/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  readonly userRoute = `${environment.server}/user`;

  constructor(private http: HttpClient) {
  }

  getUserIdFromLocalStorage() {
    const localUser = localStorage.getItem('userId');
    console.log('localUser', localUser);

    return !!localUser || localUser !== 'undefined' ? localUser : null;
  }

  getUserById(userId: string) {
    return <Observable<User>>this.http.get(`${this.userRoute}`, { params: { id: userId } })
    .pipe(
      map((u: any) => u[0])
    );
  }

  login(email: string, password: string) {
    return <Observable<User>>this.http.get(`${this.userRoute}`, { params: { email, password } })
    .pipe(
      map((u: any) => u[0])
    );
  }

  register(user: Partial<User>, password: string) {
    const payload: any = { ...user };

    if (!!password) {
      payload.password = password;
    }


    return <Observable<User>>this.http.put(`${this.userRoute}/${user.id}`, payload)
    // .pipe(
    //   map((u: any) => u[0])
    // );
  }

  registerTempUser(user: Partial<User>) {
    return <Observable<User>>this.http.post(`${this.userRoute}`, user)
    // .pipe(
    //   map((u: any) => u[0])
    // );
  }

  updateProfile(user: Partial<User>) {
    return <Observable<User>>this.http.post(`${this.userRoute}`, { user })
    // .pipe(
    //   map((u: any) => u.user)
    // );
  }
}
