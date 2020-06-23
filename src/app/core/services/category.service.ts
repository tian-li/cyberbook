import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateDefaultCategories } from '@spend-book/shared/utils/generate-default-categories';
import { forkJoin, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../model/category';

@Injectable()
export class CategoryService {
  readonly categoryRoute = `${environment.server}/category`;

  constructor(private http: HttpClient) {
  }

  loadCategoriesByUser(userId: string): Observable<Category[]> {
    return <Observable<Category[]>>this.http.get(`${this.categoryRoute}`, { params: { userId } });
  }

  // TODO: This should be done by backend
  // When a new user comes, add application default categories to this user
  addDefaultCategories(userId: string): Observable<Category[]> {
    const categories = generateDefaultCategories(userId);
    const addRequests = categories.map(category => <Observable<Category>>this.http.post(`${this.categoryRoute}`, category).pipe(delay(200)));
    return forkJoin(addRequests);
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    return <Observable<Category>>this.http.post(`${this.categoryRoute}`, category);
  }

  updateCategory(category: Partial<Category>): Observable<Category> {
    return <Observable<Category>>this.http.put(`${this.categoryRoute}/${category.id}`, category);
  }

  removeCategory(id: string): Observable<any> {
    return this.http.delete(`${this.categoryRoute}/${id}`);
  }
}
