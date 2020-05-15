import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class BookService {
  readonly bookRoute = `${environment.server}/book`;

  constructor(private http: HttpClient) {
  }

  loadBook(id: number) {
    return this.http.get(`${this.bookRoute}/${id}`);
  }
}
