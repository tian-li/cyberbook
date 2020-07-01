import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { FrequencyInfo, Subscription, SubscriptionFrequencyTypes } from '@spend-book/core/model/subscription';
import { transactionDescriptionMaxLength } from '@spend-book/core/model/transaction';

import { fromCategory } from '@spend-book/core/store';
import * as dayjs from 'dayjs';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TransactionType, TransactionTypes, years } from '../../constants';

@Component({
  selector: 'app-subscription-editor',
  templateUrl: './subscription-editor.component.html',
  styleUrls: ['./subscription-editor.component.scss']
})
export class SubscriptionEditorComponent implements OnInit {
  readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  readonly now = dayjs();
  readonly minDate = new Date();
  readonly maxDate = new Date(years[years.length - 1], 11, 31);
  readonly defaultCategoryType: TransactionType = TransactionTypes.spend;
  readonly transactionDescriptionMaxLength = transactionDescriptionMaxLength;
  readonly TransactionType = TransactionTypes;

  readonly quickFrequenciesInfo: FrequencyInfo[] = [
    { frequency: SubscriptionFrequencyTypes.day,display: '每天', interval: 1, every: '00:00:00' },
    { frequency: SubscriptionFrequencyTypes.week,display: '每周', interval: 1, every: this.now.get('day') },
    { frequency: SubscriptionFrequencyTypes.week,display: '每两周', interval: 2, every: this.now.get('day') },
    { frequency: SubscriptionFrequencyTypes.month,display: '每月', interval: 1, every: this.now.get('date') },
    { frequency: SubscriptionFrequencyTypes.year,display: '每年', interval: 1, every: this.now.format('MM/DD') },
    { frequency: 'custom', display: '自定义' },
  ];

  loading: boolean;
  title: string;
  formGroup: FormGroup;
  categories$: Observable<Category[]>;
  categoryEntities: Dictionary<Category>;

  frequencyTypeControl = new FormControl();

  selectedCategoryType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<SubscriptionEditorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { editMode: boolean, subscription: Subscription, userId: string },
    private fb: FormBuilder,
    private store: Store,
  ) {
  }

  ngOnInit(): void {

    this.store.pipe(
      select(fromCategory.selectCategoryEntities),
      takeUntil(this.unsubscribe$)
    ).subscribe(categoryEntities => {
      this.categoryEntities = categoryEntities;
    });

    this.categories$ = this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => this.store.pipe(select(fromCategory.selectAllSortedCategoriesByType, { type }))),
    );

    this.frequencyTypeControl.valueChanges.subscribe((frequencyInfo: FrequencyInfo) => {
      if (frequencyInfo.frequency === 'custom') {
        this.formGroup.controls['every'].setValue('00:00:00');
      } else {
        this.formGroup.controls['frequency'].setValue(frequencyInfo.frequency);
        this.formGroup.controls['interval'].setValue(frequencyInfo.interval);
        this.formGroup.controls['every'].setValue(frequencyInfo.every);
      }
      console.log('form', this.formGroup.value)
    });

    this.title = this.data.editMode ? '编辑账目' : '添加账目';
    this.buildForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  delete() {

  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

  save() {


  }

  changeCategoryType(type: TransactionType) {

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
      every: new FormControl(initialFormData.every),
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
        every: this.data.subscription.every,
        startDate: this.data.subscription.startDate,
        endDate: this.data.subscription.endDate,
      } :
      {
        startDate: this.today.toISOString(),
      };
  }
}
