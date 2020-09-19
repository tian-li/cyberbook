import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { fromTransaction, fromUI } from '@cyberbook/core/store';
import { setDisplayMonth } from '@cyberbook/core/store/ui/ui.actions';
import { ISOString, PeriodSummary } from '@cyberbook/shared/model/helper-models';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { YearMonthPickerComponent } from '../../../shared/components/year-month-picker/year-month-picker.component';

@Component({
  selector: 'app-book-header',
  templateUrl: './book-header.component.html',
  styleUrls: ['./book-header.component.scss']
})
export class BookHeaderComponent implements OnInit, OnDestroy {
  displayMonth: ISOString;
  monthSummary: PeriodSummary;
  dialogRef: MatDialogRef<any>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      tap(displayMonth => this.displayMonth = displayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromTransaction.getTransactionSummaryByMonth, { displayMonth: new Date(displayMonth) }))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(monthSummary => {
      this.monthSummary = monthSummary;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeMonth() {
    this.dialogRef = this.dialog.open(YearMonthPickerComponent, {
      width: '400px',
      height: '300px',
      disableClose: true,
      data: new Date(this.displayMonth)
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      if (!!result) {
        const yearMonth = new Date();
        yearMonth.setFullYear(result.year, result.month);
        this.store.dispatch(setDisplayMonth({ displayMonth: yearMonth.toISOString() }));
      }
    });
  }

}
