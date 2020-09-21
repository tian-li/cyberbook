import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import { User } from '@cyberbook/core/model/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  readonly userRoute = `${environment.server}/users`;

  constructor(private http: HttpClient) {
  }

  loginWithToken(): Observable<User> {
    return this.http.post(`${this.userRoute}/login-with-token`, {}).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post(`${this.userRoute}/login`, { email, password }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  register(user: Partial<User>, password: string): Observable<User> {
    return this.http.post(`${this.userRoute}/register`, {
      ...user,
      password,
    }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  registerTempUser(): Observable<User> {
    return this.http.post(`${this.userRoute}/register-temp-user`, {}).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  saveTempUser(user: Partial<User>, password: string): Observable<User> {
    return this.http.post(`${this.userRoute}/save-temp-user`, {
      ...user,
      password,
    }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put(`${this.userRoute}/update-profile`, user).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  setTheme(theme: string): Observable<any> {
    return this.http.post(`${this.userRoute}/set-theme`, theme);
  }
}
