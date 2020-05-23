import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction, fromUI } from '@spend-book/core/store';
import { ISOString, PeriodSummary } from '@spend-book/shared/model/helper-models';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit, OnDestroy {
  transactionVOs: TransactionVO[];

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      console.log('transactions', transactions)
      this.transactionVOs = transactions;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
