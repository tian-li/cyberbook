import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Transaction } from '../model/transaction';

@Injectable()
export class TransactionService {
  readonly transactionRoute = `${environment.server}/transactions`;

  constructor(private http: HttpClient) {
  }

  loadTransactionsByUser(): Observable<Transaction[]> {
    return this.http.get<CyberbookServerResponse>(`${this.transactionRoute}`).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<CyberbookServerResponse>(`${this.transactionRoute}`, transaction).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  updateTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<CyberbookServerResponse>(`${this.transactionRoute}/${transaction.id}`, transaction).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  removeTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.transactionRoute}/${id}`);
  }


}
