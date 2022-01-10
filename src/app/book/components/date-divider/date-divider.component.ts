import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { fromTransaction } from '@cyberbook/core/store';
import { FullDate } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-date-divider',
  templateUrl: './date-divider.component.html',
  styleUrls: ['./date-divider.component.scss']
})
export class DateDividerComponent implements OnInit, OnDestroy {
  @Input() date: dayjs.Dayjs;

  daySummary: { income: number, spend: number } = {
    income: 0,
    spend: 0
  };

  dateString: number;


  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.dateString = this.date.valueOf();
    this.store.pipe(
      select(fromTransaction.getTransactionSummaryByDate(this.date.format(FullDate))),
      takeUntil(this.unsubscribe$)
    ).subscribe(daySummary => {
      this.daySummary = daySummary;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
