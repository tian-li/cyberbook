import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../../core/model/category';
import { hasSubscriptionEnded, Subscription } from '../../../core/model/subscription';
import { fromCategory, fromSubscription, fromUI, fromUser } from '../../../core/store';
import { loadSubscriptionsByUser, updateSubscription } from '../../../core/store/subscription';
import { TransactionType, TransactionTypes } from '../../../shared/constants';
import { SwipeResult } from '../../../shared/model/helper-models';
import { SubscriptionEditorComponent } from '../subscription-editor/subscription-editor.component';

@Component({
  selector: 'app-recurring-management',
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss']
})
export class SubscriptionManagementComponent implements OnInit {
  readonly defaultCategoryType: TransactionType = TransactionTypes.spend;
  readonly today: dayjs.Dayjs = dayjs().startOf('day');
  readonly hasSubscriptionEnded = hasSubscriptionEnded;

  allSubscriptions: Subscription[];
  categoryEntities: Dictionary<Category>;
  selectedCategoryType = this.defaultCategoryType;
  userId: string;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(fromUI.hideToolbar());
    this.store.pipe(
      select(fromUser.selectUser),
      takeUntil(this.unsubscribe$)
    ).subscribe(user => {
      this.userId = user.id;
      this.store.dispatch(loadSubscriptionsByUser({ userId: user.id }))
    })

    this.store.pipe(
      select(fromSubscription.selectAllSubscriptions),
      takeUntil(this.unsubscribe$)
    ).subscribe(allSubscriptions => {
      this.allSubscriptions = allSubscriptions;
    });

    this.store.pipe(
      select(fromCategory.selectCategoryEntities),
      takeUntil(this.unsubscribe$)
    ).subscribe(categoryEntities => {
      this.categoryEntities = categoryEntities;
    })
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeCategoryType(type: TransactionType) {
    this.selectedCategoryType = type;
    // this.categoryTypeControl.setValue(type);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  editSubscription(subscription: Subscription) {
    this.bottomSheet.open(SubscriptionEditorComponent, {
      data: { subscription, editMode: true, userId: this.userId },
      disableClose: true,
    });
  }

  stopSubscription(swipeResult: SwipeResult, subscription) {
    if (swipeResult.direction === 'left' && swipeResult.result) {
      this.store.dispatch(updateSubscription({
        update: {
          id: subscription.id,
          changes: {
            endDate: dayjs().startOf('day').toISOString(),
            dateModified: dayjs().startOf('day').toISOString(),
          }
        }
      }));
    }
  }

  addSubscription() {
    this.bottomSheet.open(SubscriptionEditorComponent, {
      data: { editMode: false, userId: this.userId },
      disableClose: true,
    });
  }

  getDescriptionDisplay(subscription: Subscription): string {
    return subscription.description ? subscription.description : this.categoryEntities[subscription.categoryId].name;
  }

  getDaysUntilNextDate(subscription: Subscription): string {
    if (!this.hasSubscriptionEnded(subscription.endDate)) {
      return `, 距离下次还有${dayjs(subscription.nextDate).diff(this.today, 'day')}天`;
    }
    return '';
  }
}
