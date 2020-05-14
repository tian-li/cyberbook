import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import * as fromRoot from '../../../reducers';
import { ISOString, SpendSummary } from '../../../shared/model/helper-models';
import { TransactionVO } from '../../model/transactionVO';
import * as fromSpendBook from '../../store';
import { loadCategoriesByBook } from '../../store/category/category.actions';
import { loadTransactionsByBook } from '../../store/transaction/transaction.actions';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit, OnDestroy {
  transactionVOs: TransactionVO[];
  displayMonth: ISOString;
  monthSummary: SpendSummary = {
    income: 0,
    spend: 0
  };
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(loadTransactionsByBook({ bookId: 1 }));
    this.store.dispatch(loadCategoriesByBook({ bookId: 1 }));

    this.store.pipe(
      select(fromRoot.selectDisplayMonth),
      tap(displayMonth => this.displayMonth = displayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromSpendBook.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      this.transactionVOs = transactions;
      this.transactionVOs.forEach((transaction) => {
        if (transaction.amount > 0) {
          this.monthSummary.income += transaction.amount
        } else {
          this.monthSummary.spend -= transaction.amount
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
