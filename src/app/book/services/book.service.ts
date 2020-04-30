import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BookService {
  readonly bookRoute = "book";

  constructor(private http: HttpClient) {
  }

  loadBook(id: string) {
    return this.http.get(`${this.bookRoute}/${id}`);
  }
}
