import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';
import { environment } from '../../../environments/environment';

@Injectable()
export class CategoryService {
  readonly categoryRoute = `${environment.server}/category`;

  constructor(private http: HttpClient) {
  }

  loadCategoriesByUser(userId: string): Observable<Category[]> {
    // return <Observable<Category[]>>this.http.get(`${this.categoryRoute}/book/${bookId}`);
    return <Observable<Category[]>>this.http.get(`${this.categoryRoute}`, { params: { userId } });
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
