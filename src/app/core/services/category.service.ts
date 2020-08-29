import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@spend-book/core/model/cyberbook-server-response';
import { TransactionTypes } from '@spend-book/shared/constants';
import { generateDefaultCategories } from '@spend-book/shared/utils/generate-default-categories';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../model/category';

@Injectable()
export class CategoryService {
  readonly categoryRoute = `${environment.server}/categories`;

  constructor(private http: HttpClient) {
  }

  loadCategoriesByUser(userId: string): Observable<Category[]> {
    return <Observable<Category[]>>this.http.get(`${this.categoryRoute}`, { params: { userId } }).pipe(
      map((res: CyberbookServerResponse) => res.data.map(data => this.convertToCategory(data)))
    );
  }

  // TODO: This should be done by backend
  // When a new user comes, add application default categories to this user
  addDefaultCategories(userId: string): Observable<Category[]> {
    const categories = generateDefaultCategories(userId);
    const addRequests = categories.map(category =>
      <Observable<Category>>this.http.post(`${this.categoryRoute}`, category).pipe(concatMap(x => of(x).pipe(delay(500)))));
    return forkJoin(addRequests);
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    const payload = {
      ...category,
      isSpend: category.type === TransactionTypes.spend
    };

    return <Observable<Category>>this.http.post(`${this.categoryRoute}`, payload).pipe(
      map((res: CyberbookServerResponse) => this.convertToCategory(res.data))
    );
  }

  updateCategory(category: Partial<Category>): Observable<Category> {
    const payload = {
      ...category,
      isSpend: category.type === TransactionTypes.spend
    };

    return <Observable<Category>>this.http.put(`${this.categoryRoute}/${category.id}`, payload).pipe(
      map((res: CyberbookServerResponse) => this.convertToCategory(res.data))
    );
  }

  removeCategory(id: string): Observable<any> {
    return this.http.delete(`${this.categoryRoute}/${id}`);
  }

  private convertToCategory(responseData): Category {
    return {
      ...responseData,
      type: responseData.isSpend ? TransactionTypes.spend : TransactionTypes.income
    }
  }
}
