import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction';

@Injectable()
export class TransactionService {
  readonly transactionRoute = 'transaction';

  constructor(private http: HttpClient) {
  }

  loadTransactionsByBook(bookId: number): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this.http.get(`${this.transactionRoute}/book/${bookId}`);
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.post(`${this.transactionRoute}`, transaction);
  }

  updateTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.put(`${this.transactionRoute}/${transaction.id}`, transaction);
  }

  removeTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.transactionRoute}/${id}`);
  }
}
