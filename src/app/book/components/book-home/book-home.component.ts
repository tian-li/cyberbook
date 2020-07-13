import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { hasSubscriptionEnded, Subscription } from '@spend-book/core/model/subscription';
import { Transaction } from '@spend-book/core/model/transaction';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { User } from '@spend-book/core/model/user';
import { fromSubscription, fromTransaction, fromUI, fromUser } from '@spend-book/core/store';
import { ISOString } from '@spend-book/shared/model/helper-models';
import { calculateSubscriptionNextDate } from '@spend-book/shared/utils/calculate-subscription-next-date';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

dayjs.extend(isSameOrAfter);

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit, OnDestroy {
  readonly today: dayjs.Dayjs = dayjs();
  transactionVOs: TransactionVO[];


  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.pipe()

    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      this.transactionVOs = transactions;
    });

    this.store.pipe(
      select(fromSubscription.selectAllSubscriptions),
      withLatestFrom(this.store.pipe(select(fromUser.selectUser))),
      takeUntil(this.unsubscribe$)
    ).subscribe(([subscriptions, user]: [Subscription[], User]) => {
      subscriptions.forEach((subscription: Subscription) => {
        // TODO: server should automatically add subscription transactions on a new day
        //  move this logic to server
        if (!hasSubscriptionEnded(subscription.endDate) && this.today.isSameOrAfter(subscription.nextDate, 'day')) {
          this.createSubscriptionTransaction(subscription, user.id);
          this.updateSubscription(subscription);
        }
      });
    });
  }

  createSubscriptionTransaction(subscription: Subscription, userId: string) {
    const transaction: Transaction = {
      id: uuid(),
      userId: userId,
      amount: subscription.amount,
      description: subscription.description,
      categoryId: subscription.categoryId,
      dateCreated: dayjs(subscription.nextDate).toISOString(),
      transactionDate: dayjs(subscription.nextDate).toISOString(),
      dateModified: dayjs(subscription.nextDate).toISOString(),
      subscriptionId: subscription.id,
    };

    this.store.dispatch(fromTransaction.addTransaction({ transaction }));
  }

  updateSubscription(subscription: Subscription) {
    const nextDate = calculateSubscriptionNextDate(
      subscription.frequency,
      subscription.interval,
      dayjs(subscription.startDate),
      dayjs(subscription.nextDate)
    );

    this.store.dispatch(fromSubscription.updateSubscription({
      update: {
        id: subscription.id,
        changes: {
          nextDate: nextDate,
          totalAmount: subscription.totalAmount + subscription.amount
        }
      }
    }));

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
