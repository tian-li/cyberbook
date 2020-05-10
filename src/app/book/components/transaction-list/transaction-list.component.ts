import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import * as fromRoot from '../../../reducers';
import { TransactionVO } from '../../model/transactionVO';
import * as fromSpendBook from '../../store';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  transactions: TransactionVO[];
  private unsubscribe$: Subject<void> = new Subject();


  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromRoot.selectDisplayMonth),
      switchMap((displayMonth: string) => {
        return this.store.pipe(select(fromSpendBook.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isFirstOfDate(transaction: TransactionVO, index: number): boolean {
    return index > 0 && index < this.transactions.length - 1 &&
      transaction.transactionDate.getDate() !== this.transactions[index - 1].transactionDate.getDate();
  }
}
