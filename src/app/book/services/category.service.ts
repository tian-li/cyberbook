import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';

@Injectable()
export class CategoryService {
  readonly categoryRoute = 'category';

  constructor(private http: HttpClient) {
  }

  loadCategoriesByBook(bookId: number): Observable<Category[]> {
    return <Observable<Category[]>>this.http.get(`${this.categoryRoute}/book/${bookId}`);
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    return <Observable<Category>>this.http.post(`${this.categoryRoute}`, category);
  }

  updateCategory(category: Partial<Category>): Observable<Category> {
    return <Observable<Category>>this.http.put(`${this.categoryRoute}/${category.id}`, category);
  }

  removeCategory(id: number): Observable<any> {
    return this.http.delete(`${this.categoryRoute}/${id}`);
  }
}
