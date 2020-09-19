import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Category } from '@cyberbook/core/model/category';
import { Subscription, SubscriptionFrequencyTypes } from '@cyberbook/core/model/subscription';
import { transactionDescriptionMaxLength } from '@cyberbook/core/model/transaction';
import { fromCategory } from '@cyberbook/core/store';
import { addSubscription, updateSubscription } from '@cyberbook/core/store/subscription';
import { TransactionType, TransactionTypes, years } from '@cyberbook/shared/constants';
import { ISOString } from '@cyberbook/shared/model/helper-models';
import { calculateSubscriptionNextDate } from '@cyberbook/shared/utils/calculate-subscription-next-date';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

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
  readonly frequencies: { value: SubscriptionFrequencyTypes, display: string }[] = [
    {value: SubscriptionFrequencyTypes.minute, display: '分钟'},
    {value: SubscriptionFrequencyTypes.day, display: '天'},
    {value: SubscriptionFrequencyTypes.week, display: '星期'},
    {value: SubscriptionFrequencyTypes.month, display: '月'},
    {value: SubscriptionFrequencyTypes.year, display: '年'},
  ];

  readonly categoryTypes = [
    {value: 'spend', display: '支出'},
    {value: 'income', display: '收入'},
  ];

  periods: number[] = [];
  loading: boolean;
  title: string;
  formGroup: FormGroup;
  categories$: Observable<Category[]>;
  categoryEntities: Dictionary<Category>;
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
      this.periods.push(i);
    }
  }

  ngOnInit(): void {
    this.title = this.data.editMode ? '编辑周期性账目' : '添加周期性账目';

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

  changeCategoryType(type: string) {
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
      formValue.period,
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
      period: formValue.period,
      startDate: dayjs(formValue.startDate).toISOString(),
      endDate: formValue.endDate ? dayjs(formValue.endDate).toISOString() : null,
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

  get periodControlValue(): number {
    return this.formGroup.controls['period'].value;
  }

  get frequencyControlValue(): SubscriptionFrequencyTypes {
    return this.formGroup.controls['frequency'].value;
  }

  get startDateControlValue(): string | Date {
    return this.formGroup.controls['startDate'].value;
  }

  get showSummary(): boolean {
    return !!this.periodControlValue && !!this.frequencyControlValue && !!this.startDateControlValue;
  }

  get summary(): string {
    let summary: string;
    let periodStr: string | number;

    if (this.periodControlValue === 1) {
      periodStr = '';
    } else if (this.periodControlValue === 2) {
      periodStr = '两'
    } else {
      periodStr = this.periodControlValue;
    }

    switch (this.frequencyControlValue) {
      case SubscriptionFrequencyTypes.minute:
        summary = `每${periodStr}分钟`;
        break;
      case SubscriptionFrequencyTypes.day:
        summary = `每${periodStr}天`;
        break;
      case SubscriptionFrequencyTypes.week:
        summary = `每${periodStr}个星期的${dayjs(this.startDateControlValue).format('dddd')}`
        break;
      case SubscriptionFrequencyTypes.month:
        summary = `每${periodStr}个月的${dayjs(this.startDateControlValue).format('D号')}`
        break;
      case SubscriptionFrequencyTypes.year:
        summary = `每${periodStr}年的${dayjs(this.startDateControlValue).format('M月D号')}`
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
      period: new FormControl(initialFormData.period),
    });
  }

  private getInitialFormData(): Partial<Subscription> {
    return this.data.editMode ?
      {
        amount: Math.abs(this.data.subscription.amount),
        description: this.data.subscription.description,
        categoryId: this.data.subscription.categoryId,
        frequency: this.data.subscription.frequency,
        period: this.data.subscription.period,
        startDate: this.data.subscription.startDate,
        endDate: this.data.subscription.endDate,
      } :
      {
        period: 1,
        startDate: this.today.toISOString(),
      };
  }
}
