import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setDisplayMonth } from '../../../core/store/ui/ui.actions';
import { ISOString, SpendSummary } from '../../../shared/model/helper-models';
import { YearMonthPickerComponent } from '../year-month-picker/year-month-picker.component';

@Component({
  selector: 'app-book-header',
  templateUrl: './book-header.component.html',
  styleUrls: ['./book-header.component.scss']
})
export class BookHeaderComponent implements OnDestroy {
  @Input() displayMonth: ISOString;
  @Input() monthSummary: SpendSummary;
  dialogRef: MatDialogRef<any>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private dialog: MatDialog) {
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
    })
  }

}
