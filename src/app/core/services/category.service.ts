import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import { TransactionTypes } from '@cyberbook/shared/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../model/category';

@Injectable()
export class CategoryService {
  readonly categoryRoute = `${environment.server}/categories`;

  constructor(private http: HttpClient) {
  }

  loadCategoriesByUser(): Observable<Category[]> {
    return <Observable<Category[]>>this.http.get(`${this.categoryRoute}`).pipe(
      map((res: CyberbookServerResponse) => res.data.map(data => this.convertToCategory(data)))
    );
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
