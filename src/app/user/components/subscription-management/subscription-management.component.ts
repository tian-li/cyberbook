import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@cyberbook/core/model/category';
import { hasSubscriptionEnded, Subscription } from '@cyberbook/core/model/subscription';
import { fromCategory, fromSubscription, fromUI } from '@cyberbook/core/store';
import { loadSubscriptionsByUser, removeSubscription, stopSubscription } from '@cyberbook/core/store/subscription';
import { SwipeResult } from '@cyberbook/shared/model/helper-models';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { debounceTime, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { hideToolbar } from '../../../core/store/ui';
import { SubscriptionEditorComponent } from '../subscription-editor/subscription-editor.component';

@Component({
  selector: 'app-recurring-management',
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss']
})
export class SubscriptionManagementComponent implements OnInit, OnDestroy {
  readonly defaultSubscriptionActivateStatus = true;
  readonly today: dayjs.Dayjs = dayjs().startOf('day');
  readonly hasSubscriptionEnded = hasSubscriptionEnded;

  readonly subscriptionTypes = [
    { value: true, display: '进行中' },
    { value: false, display: '已结束' },
  ];

  allSubscriptions!: Subscription[];
  categoryEntities!: Dictionary<Category>;
  selectedCategoryType = this.defaultSubscriptionActivateStatus;
  subscriptionTypeControl = new FormControl(this.defaultSubscriptionActivateStatus);

  typeSwitcherConfig = {
    enabled: true,
    types: this.subscriptionTypes
  };

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(hideToolbar());
    this.store.dispatch(loadSubscriptionsByUser());

    this.subscriptionTypeControl.valueChanges.pipe(
      startWith(this.defaultSubscriptionActivateStatus),
      switchMap(activateStatus =>
        this.store.pipe(select(fromSubscription.selectAllSubscriptionsByActiveStatus(activateStatus)))
      ),
      debounceTime(200),
      takeUntil(this.unsubscribe$)
    ).subscribe(allSubscriptions => {
      this.allSubscriptions = allSubscriptions;
    });

    this.store.pipe(
      select(fromCategory.selectCategoryEntities),
      takeUntil(this.unsubscribe$)
    ).subscribe(categoryEntities => {
      this.categoryEntities = categoryEntities;
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeSubscriptionType(type: string | boolean) {
    this.selectedCategoryType = <boolean>type;
    this.subscriptionTypeControl.setValue(type);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  editSubscription(subscription: Subscription) {
    if (subscription.activateStatus) {
      this.bottomSheet.open(SubscriptionEditorComponent, {
        data: { subscription, editMode: true },
        disableClose: true,
      });
    }
  }

  onSwipe(swipeResult: SwipeResult, subscription: Subscription) {
    if (swipeResult.direction === 'right' && swipeResult.result) {
      this.stopSubscription(subscription);
    }

    if (swipeResult.direction === 'left' && swipeResult.result) {
      this.removeSubscription(subscription);
    }
  }

  addSubscription() {
    this.bottomSheet.open(SubscriptionEditorComponent, {
      data: { editMode: false },
      disableClose: true,
    });
  }

  getDescriptionDisplay(subscription: Subscription): string | undefined {
    return subscription.description ? subscription.description : this.categoryEntities[subscription.categoryId]?.name;
  }

  quickOverview(subscription: Subscription): string {
    if (subscription.activateStatus) {
      return `${subscription.summary}, 距离下次还有${dayjs(subscription.nextDate).diff(this.today, 'day')}天`;
    } else {
      return `已于${dayjs(subscription.endDate).format('YYYY年MM月DD日')}结束`;
    }
  }

  trackByFn(index: number, item: Subscription): string {
    return item.id;
  }

  private stopSubscription(subscription: Subscription) {
    this.store.dispatch(stopSubscription({ id: subscription.id }));
  }

  private removeSubscription(subscription: Subscription) {
    this.store.dispatch(removeSubscription({ id: subscription.id }));
  }
}
