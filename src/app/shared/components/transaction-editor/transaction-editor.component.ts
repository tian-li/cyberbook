import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '@cyberbook/core/model/category';
import { Transaction, transactionDescriptionMaxLength } from '@cyberbook/core/model/transaction';
import { fromCategory } from '@cyberbook/core/store';
import {
  addTransaction,
  removeTransaction,
  updateTransaction
} from '@cyberbook/core/store/transaction/transaction.actions';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TransactionTypes, years } from '../../constants';

@Component({
  selector: 'app-transaction-editor',
  templateUrl: './transaction-editor.component.html',
  styleUrls: ['./transaction-editor.component.scss']
})
export class TransactionEditorComponent implements OnInit, OnDestroy {
  readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  readonly now = new Date();
  readonly minDate = new Date(years[0], 0, 1);
  readonly maxDate = new Date(years[years.length - 1], 11, 31);
  readonly transactionDescriptionMaxLength = transactionDescriptionMaxLength;
  readonly defaultCategoryType: string = TransactionTypes.spend;
  readonly categoryTypes = [
    { value: 'spend', display: '支出' },
    { value: 'income', display: '收入' },
  ];

  loading: boolean;
  title: string;
  formGroup: FormGroup;
  categories$: Observable<Category[]>;
  categoryEntities: Dictionary<Category>;

  selectedCategoryType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private dialogRef: MatDialogRef<TransactionEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { editMode: boolean, transaction: Transaction },
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

    this.title = this.data.editMode ? '编辑账目' : '添加账目';
    this.buildForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeCategoryType(type: string) {
    this.selectedCategoryType = type;
    this.categoryTypeControl.setValue(type);
    this.formGroup.get('categoryId').reset(undefined);
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.loading = true;

    const action = this.data.editMode ?
      updateTransaction({ transaction: this.editedTransaction }) :
      addTransaction({ transaction: this.editedTransaction });

    this.store.dispatch(action);
  }

  delete() {
    this.store.dispatch(removeTransaction({ id: this.data.transaction.id }));
  }

  private get editedTransaction(): Partial<Transaction> {
    const formValue = this.formGroup.value;
    let amount = Number.parseFloat(Number.parseFloat(formValue.amount).toFixed(2));

    if (this.categoryEntities[formValue.categoryId].type === 'spend') {
      amount = 0 - amount;
    }

    let transaction: Partial<Transaction> = {
      amount,
      description: formValue.description,
      categoryId: formValue.categoryId,
    };

    if (this.data.editMode) {
      transaction = {
        ...transaction,
        id: this.data.transaction.id,
      };
    }

    return transaction;
  }

  private buildForm() {
    const initialFormData = this.getInitialFormData();
    this.formGroup = this.fb.group({
      amount: new FormControl(initialFormData.amount, [Validators.required, Validators.pattern(/^\d*(\.\d{0,2})?$/)]),
      description: new FormControl(
        initialFormData.description,
        Validators.maxLength(this.transactionDescriptionMaxLength)
      ),
      categoryId: new FormControl(initialFormData.categoryId, Validators.required),
      transactionDate: new FormControl(initialFormData.transactionDate),
    });
  }

  private getInitialFormData(): Partial<Transaction> {
    return this.data.editMode ?
      {
        amount: Math.abs(this.data.transaction.amount),
        description: this.data.transaction.description,
        categoryId: this.data.transaction.categoryId,
        transactionDate: this.data.transaction.transactionDate,
      } :
      {
        transactionDate: this.today.toISOString(),
      };
  }

}
