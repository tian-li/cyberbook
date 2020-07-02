import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../../core/model/category';
import { Subscription } from '../../../core/model/subscription';
import { fromCategory, fromSubscription, fromUI, fromUser } from '../../../core/store';
import { updateSubscription } from '../../../core/store/subscription';
import { SubscriptionEditorComponent } from '../../../shared/components/subscription-editor/subscription-editor.component';
import { TransactionType, TransactionTypes } from '../../../shared/constants';

@Component({
  selector: 'app-recurring-management',
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss']
})
export class SubscriptionManagementComponent implements OnInit {
  readonly defaultCategoryType: TransactionType = TransactionTypes.spend;

  allSubscriptions: Subscription[];
  categoryEntities: Dictionary<Category>;
  selectedCategoryType = this.defaultCategoryType;
  userId: string;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.dispatch(fromUI.hideToolbar());
    this.store.pipe(
      select(fromUser.selectUser)
    ).subscribe(user => {
      this.userId = user.id;
    })

    this.store.pipe(
      select(fromSubscription.selectAllSubscriptions),
      takeUntil(this.unsubscribe$)
    ).subscribe(allSubscriptions => {
      this.allSubscriptions = allSubscriptions;
    });

    this.store.pipe(
      select(fromCategory.selectCategoryEntities)
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
    console.log('editSubscription', subscription)
    this.bottomSheet.open(SubscriptionEditorComponent, {
      data: { subscription, editMode: true },
      disableClose: true,
    });
  }

  stopSubscription(event, subscription) {
    console.log('stopSubscription', subscription)
    this.store.dispatch(updateSubscription({
      subscription: {
        ...subscription,
        endDate: dayjs().endOf('day').toISOString(),
        dateModified: dayjs().endOf('day').toISOString(),
      }
    }));
  }

  add() {
    this.bottomSheet.open(SubscriptionEditorComponent, {
      data: { editMode: false },
      disableClose: true,
    });
  }

  getDescriptionDisplay(subscription: Subscription): string {
    return subscription.description ? subscription.description : this.categoryEntities[subscription.categoryId].name;
  }

  // addSubscription() {
  //   const date = dayjs().toISOString();
  //   const categories: Category[] = Object.values(this.categoryEntities);
  //   const index = Math.floor(Math.random() * categories.length);
  //   const category = categories[index];
  //   // console.log('date', date);
  //   console.log('category', category)
  //   const subscription: Subscription = {
  //     id: uuid(),
  //     userId: this.userId,
  //     amount: 12,
  //     description: category.name + 'description',
  //     frequency: SubscriptionFrequencyTypes.week,
  //     interval: 2,
  //     // every: 2,
  //     startDate: date,
  //     endDate: date,
  //     categoryId: category.id,
  //     dateCreated: date,
  //     dateModified: date,
  //     nextDate: date,
  //   }
  //
  //   console.log('subscription', subscription);
  //
  //   this.store.dispatch(addSubscription({ subscription }));
  // }

}
