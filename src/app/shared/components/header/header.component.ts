import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { fromUI } from '@spend-book/core/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setDisplayMonth } from '@spend-book/core/store/ui/ui.actions';
import { ISOString, SpendSummary } from '@spend-book/shared/model/helper-models';
import { YearMonthPickerComponent } from '../year-month-picker/year-month-picker.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,  OnDestroy {
  displayMonth: ISOString;
  @Input() monthSummary: SpendSummary;
  dialogRef: MatDialogRef<any>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(fromUI.selectDisplayMonth)).subscribe(displayMonth => this.displayMonth = displayMonth);
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
