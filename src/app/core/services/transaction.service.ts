import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Transaction } from '../model/transaction';

@Injectable()
export class TransactionService {
  readonly transactionRoute = `${environment.server}/transaction`;

  constructor(private http: HttpClient) {
  }

  loadTransactionsByUser(userId: string): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this.http.get(`${this.transactionRoute}`, { params: { userId } });
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    // TODO: remove after server can do this
    transaction = {
      ...transaction,
      dateCreated: transaction.transactionDate,
      dateModified: transaction.transactionDate,
    }

    return <Observable<Transaction>>this.http.post(`${this.transactionRoute}`, transaction);
  }

  updateTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.put(`${this.transactionRoute}/${transaction.id}`, transaction);
  }

  removeTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.transactionRoute}/${id}`);
  }
}
