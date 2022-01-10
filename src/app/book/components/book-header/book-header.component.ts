import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromTransaction, fromUI } from '@cyberbook/core/store';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { setDisplayMonth } from '@cyberbook/core/store/ui/ui.actions';
import { YearMonthPickerComponent } from '@cyberbook/shared/components/year-month-picker/year-month-picker.component';
import { ISOString, PeriodSummary } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-book-header',
  templateUrl: './book-header.component.html',
  styleUrls: ['./book-header.component.scss']
})
export class BookHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('headerRef') headerRef: ElementRef;

  displayMonth: ISOString;
  monthSummary: PeriodSummary;
  dialogRef: MatDialogRef<any>;
  balance: number;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      tap(displayMonth => this.displayMonth = displayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromTransaction.getTransactionSummaryByMonth(new Date(displayMonth))))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(monthSummary => {
      this.monthSummary = monthSummary;
      this.balance = monthSummary.income - monthSummary.spend;
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

  previousMonth() {
    this.store.dispatch(setDisplayMonth({ displayMonth: dayjs(this.displayMonth).subtract(1, 'month').toISOString() }));
  }

  nextMonth() {
    this.store.dispatch(setDisplayMonth({ displayMonth: dayjs(this.displayMonth).add(1, 'month').toISOString() }));
  }

  search() {
    this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '开发中的功能', duration: 10000000, prefixIcon: '🚧' } }));
    // this.store.dispatch(addTransactionSuccess({ transaction: {
    //     "id": "123123123",
    //     "userId": "03a77da8-d51b-41ee-b339-7f74cb2fdcd2",
    //     "amount": -7,
    //     "description": "测试",
    //     "categoryId": "18daa0d1-469a-4434-b443-7cf0f3dd0f84",
    //     // "subscriptionId": "a4aab225-25ce-4658-a113-401818a004d2",
    //     "transactionDate": "2020-12-11T06:00:00.000Z",
    //     "dateCreated": "2020-12-11T06:00:00.000Z",
    //     "dateModified": "2020-12-11T06:00:00.000Z"
    //   } }));

  }

}
