import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@spend-book/core/model/cyberbook-server-response';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Transaction } from '../model/transaction';

@Injectable()
export class TransactionService {
  readonly transactionRoute = `${environment.server}/transactions`;

  constructor(private http: HttpClient) {
  }

  loadTransactionsByUser(userId: string): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this.http.get(`${this.transactionRoute}`, { params: { userId } }).pipe(
      map((res: CyberbookServerResponse) => res.data.map(data => this.convertToTransaction(data)))
    );
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.post(`${this.transactionRoute}`, transaction).pipe(
      map((res: CyberbookServerResponse) => this.convertToTransaction(res.data))
    );
  }

  updateTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.put(`${this.transactionRoute}/${transaction.id}`, transaction).pipe(
      map((res: CyberbookServerResponse) => this.convertToTransaction(res.data))
    );
  }

  removeTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.transactionRoute}/${id}`);
  }

  private convertToTransaction(responseData): Transaction {
    return {
      ...responseData,
      // transactionDate: dayjs(responseData.transactionDate).toISOString(),
      // dateCreated: dayjs(responseData.dateCreated).toISOString(),
      // dateModified: dayjs(responseData.dateModified).toISOString(),
    }
  }
}
