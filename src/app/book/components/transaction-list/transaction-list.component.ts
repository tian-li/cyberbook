import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction } from '../../model/transaction';
import { TransactionVO } from '../../model/transactionVO';
import * as fromSpendBook from '../../store';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  transactions$: Observable<TransactionVO[]>

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.transactions$ = this.store.pipe(select(fromSpendBook.selectAllTransactionsVO));
    // this.store.pipe(select(fromSpendBook.selectAllTransactionsVO));
  }

}
