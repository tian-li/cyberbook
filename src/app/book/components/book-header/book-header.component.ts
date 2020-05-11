import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setDisplayMonth } from '../../../core/store/ui/ui.actions';
import * as fromRoot from '../../../reducers';
import { YearMonthPickerComponent } from '../year-month-picker/year-month-picker.component';

@Component({
  selector: 'app-book-header',
  templateUrl: './book-header.component.html',
  styleUrls: ['./book-header.component.scss']
})
export class BookHeaderComponent implements OnInit, OnDestroy {
  displayMonth: string;
  dialogRef: MatDialogRef<any>;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromRoot.selectDisplayMonth),
      takeUntil(this.unsubscribe$)
    ).subscribe(displayMonth => {
      this.displayMonth = displayMonth;
    })
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

    this.dialogRef.afterClosed().subscribe(result => {
      // console.log('result', result);
      if (!!result) {
        const yearMonth = new Date();
        yearMonth.setFullYear(result.year, result.month);
        // console.log('yearMonth', yearMonth)
        this.store.dispatch(setDisplayMonth({displayMonth: yearMonth.toISOString()}));
      }
    })
  }

}
