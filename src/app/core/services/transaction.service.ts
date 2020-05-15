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

  loadTransactionsByBook(bookId: number): Observable<Transaction[]> {
    // return <Observable<Transaction[]>>this.http.get(`${this.transactionRoute}/book/${bookId}`);
    return <Observable<Transaction[]>>this.http.get(`${this.transactionRoute}`, { params: { bookId: bookId + '' } })
    // .pipe(
    //   map((transactions: any[]) => transactions.map(this.convertDate))
    // );
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    // TODO: remove after server can do this
    transaction = {
      ...transaction,
      dateCreated: transaction.transactionDate,
      dateModified: transaction.transactionDate,
      bookId: 1
    }

    return <Observable<Transaction>>this.http.post(`${this.transactionRoute}`, transaction)
    // .pipe(
    //   map(this.convertDate)
    // );
  }

  updateTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return <Observable<Transaction>>this.http.put(`${this.transactionRoute}/${transaction.id}`, transaction)
    // .pipe(
    //   map(this.convertDate)
    // );
  }

  removeTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.transactionRoute}/${id}`);
  }

  convertDate(transaction): Transaction {
    return {
      ...transaction,
      transactionDate: new Date(transaction.transactionDate),
      dateCreated: new Date(transaction.dateCreated),
      dateModified: new Date(transaction.dateModified),
    }
  }
}
