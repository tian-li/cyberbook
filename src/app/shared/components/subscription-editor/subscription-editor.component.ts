import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { Subscription, SubscriptionFrequencyTypes } from '@spend-book/core/model/subscription';
import { transactionDescriptionMaxLength } from '@spend-book/core/model/transaction';
import { fromCategory, fromUser } from '@spend-book/core/store';
import { addSubscription, updateSubscription } from '@spend-book/core/store/subscription';
import { ISOString } from '@spend-book/shared/model/helper-models';
import { calculateSubscriptionNextDate } from '@spend-book/shared/utils/calculate-subscription-next-date';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { TransactionType, TransactionTypes, years } from '../../constants';

@Component({
  selector: 'app-subscription-editor',
  templateUrl: './subscription-editor.component.html',
  styleUrls: ['./subscription-editor.component.scss']
})
export class SubscriptionEditorComponent implements OnInit {
  readonly today = dayjs().startOf('day');
  readonly minStartDate = new Date();
  readonly maxDate = new Date(years[years.length - 1], 11, 31);
  readonly defaultCategoryType: TransactionType = TransactionTypes.spend;
  readonly transactionDescriptionMaxLength = transactionDescriptionMaxLength;
  readonly TransactionType = TransactionTypes;
  readonly frequencies: SubscriptionFrequencyTypes[] = [
    SubscriptionFrequencyTypes.day,
    SubscriptionFrequencyTypes.week,
    SubscriptionFrequencyTypes.month,
    SubscriptionFrequencyTypes.year,
  ];

  intervals: number[] = [];
  loading: boolean;
  title: string;
  formGroup: FormGroup;
  categories$: Observable<Category[]>;
  categoryEntities: Dictionary<Category>;
  userId: string;
  categoryTypeControl = new FormControl(this.defaultCategoryType);

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<SubscriptionEditorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { editMode: boolean, subscription: Subscription },
    private fb: FormBuilder,
    private store: Store,
  ) {
    dayjs.locale('zh-cn');

    for (let i = 1; i <= 99; i++) {
      this.intervals.push(i);
    }
  }

  ngOnInit(): void {
    this.title = this.data.editMode ? '编辑周期性账目' : '添加周期性账目';
    console.log('data', this.data);
    this.store.pipe(
      select(fromUser.selectUser),
      take(1)
    ).subscribe(user => this.userId = user.id);

    this.store.pipe(
      select(fromCategory.selectCategoryEntities),
      takeUntil(this.unsubscribe$)
    ).subscribe(categoryEntities => {
      this.categoryEntities = categoryEntities;
    });

    this.categories$ = this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => {
        return this.store.pipe(select(fromCategory.selectAllSortedCategoriesByType, { type }))
      }),
    );

    this.buildForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeCategoryType(type: TransactionType) {
    this.categoryTypeControl.setValue(type);
    this.formGroup.controls['categoryId'].reset();
  }

  save() {
    const action = this.data.editMode ?
      updateSubscription({ update: { id: this.data.subscription.id, changes: this.editedSubscription } }) :
      addSubscription({ subscription: this.editedSubscription });

    this.store.dispatch(action);
    this.bottomSheetRef.dismiss();
  }

  delete() {

  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

  get editedSubscription(): Partial<Subscription> {
    const formValue = this.formGroup.value;

    const nextDate: ISOString = calculateSubscriptionNextDate(
      formValue.frequency,
      formValue.interval,
      dayjs(formValue.startDate),
      null,
    );

    let amount = Number.parseFloat(Number.parseFloat(formValue.amount).toFixed(2));

    if (this.categoryEntities[formValue.categoryId].type === 'spend') {
      amount = 0 - amount;
    }

    let subscription: Partial<Subscription> = {
      nextDate,
      amount,
      description: formValue.description ? formValue.description.trim() : null,
      frequency: formValue.frequency,
      interval: formValue.interval,
      startDate: dayjs(formValue.startDate).toISOString(),
      endDate: formValue.endDate ? formValue.endDate.toISOString() : null,
      categoryId: formValue.categoryId,
      dateModified: this.today.toISOString(),
      summary: this.summary
    };

    if (this.data.editMode) {
      subscription = {
        ...subscription,
        id: this.data.subscription.id,
        userId: this.data.subscription.userId,

        // TODO: remove after server can do this
        dateCreated: this.data.subscription.dateCreated
      };
    } else {
      subscription = {
        ...subscription,
        id: uuid(),
        userId: this.userId,
        totalAmount: 0,
        dateCreated: this.today.toISOString()
      }
    }

    return subscription;
  }

  get minEndDate() {
    return dayjs(this.startDateControlValue).add(1, 'day').toDate();
  }

  get startDateDayOfWeek() {
    return dayjs(this.startDateControlValue).format('dddd');
  }

  get intervalControlValue(): number {
    return this.formGroup.controls['interval'].value;
  }

  get frequencyControlValue(): SubscriptionFrequencyTypes {
    return this.formGroup.controls['frequency'].value;
  }

  get startDateControlValue(): string | Date {
    return this.formGroup.controls['startDate'].value;
  }

  get showSummary(): boolean {
    return !!this.intervalControlValue && !!this.frequencyControlValue && !!this.startDateControlValue;
  }

  get summary(): string {
    let summary: string;
    let intervalStr: string | number;

    if (this.intervalControlValue === 1) {
      intervalStr = '';
    } else if (this.intervalControlValue === 2) {
      intervalStr = '两'
    } else {
      intervalStr = this.intervalControlValue;
    }

    switch (this.frequencyControlValue) {
      case SubscriptionFrequencyTypes.day:
        summary = `每${intervalStr}天`;
        break;
      case SubscriptionFrequencyTypes.week:
        summary = `每${intervalStr}个星期的${dayjs(this.startDateControlValue).format('dddd')}`
        break;
      case SubscriptionFrequencyTypes.month:
        summary = `每${intervalStr}个月的${dayjs(this.startDateControlValue).format('D号')}`
        break;
      case SubscriptionFrequencyTypes.year:
        summary = `每${intervalStr}年的${dayjs(this.startDateControlValue).format('M月D号')}`
        break;
      default:
        break;
    }

    return summary;
  }

  private buildForm() {
    const initialFormData = this.getInitialFormData();
    this.formGroup = this.fb.group({
      amount: new FormControl(initialFormData.amount, [Validators.required, Validators.pattern(/^\d*(\.\d{0,2})?$/)]),
      description: new FormControl(initialFormData.description, Validators.maxLength(this.transactionDescriptionMaxLength)),
      categoryId: new FormControl(initialFormData.categoryId, Validators.required),
      startDate: new FormControl(initialFormData.startDate),
      endDate: new FormControl(initialFormData.endDate),
      frequency: new FormControl(initialFormData.frequency),
      interval: new FormControl(initialFormData.interval),
    });
  }

  private getInitialFormData(): Partial<Subscription> {
    return this.data.editMode ?
      {
        amount: Math.abs(this.data.subscription.amount),
        description: this.data.subscription.description,
        categoryId: this.data.subscription.categoryId,
        frequency: this.data.subscription.frequency,
        interval: this.data.subscription.interval,
        startDate: this.data.subscription.startDate,
        endDate: this.data.subscription.endDate,
      } :
      {
        interval: 1,
        startDate: this.today.toISOString(),
      };
  }
}
