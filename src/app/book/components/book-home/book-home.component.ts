import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BookHeaderComponent } from '@cyberbook/book/components/book-header/book-header.component';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';
import { fromTransaction, fromUI } from '@cyberbook/core/store';
import { ISOString } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly today: dayjs.Dayjs = dayjs();

  @ViewChild(BookHeaderComponent) bookHeaderComponent: BookHeaderComponent;

  transactionVOs: TransactionVO[];
  headerHeight: string;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(
          select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) })
        )
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      this.transactionVOs = transactions;
    });
  }

  ngAfterViewInit() {
    // to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.headerHeight = this.bookHeaderComponent.headerRef.nativeElement.offsetHeight + 'px';
    }, 0);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
