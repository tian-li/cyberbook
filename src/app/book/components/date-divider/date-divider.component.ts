import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { fromTransaction } from '@spend-book/core/store'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-date-divider',
  templateUrl: './date-divider.component.html',
  styleUrls: ['./date-divider.component.scss']
})
export class DateDividerComponent implements OnInit, OnDestroy {
  @Input() date: Date;
  daySummary: { income: number, spend: number };

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromTransaction.getTransactionIdsByDate, { date: this.date.toISOString().substring(0, 10) }),
      takeUntil(this.unsubscribe$)
    ).subscribe(daySummary => this.daySummary = daySummary);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
