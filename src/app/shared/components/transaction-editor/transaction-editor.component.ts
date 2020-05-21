import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { Transaction, transactionDescriptionMaxLength } from '@spend-book/core/model/transaction';
import { fromCategory } from '@spend-book/core/store';
import { addTransaction, updateTransaction } from '@spend-book/core/store/transaction/transaction.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { years } from '../../constants';

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

  loading: boolean;
  title: string;
  formGroup: FormGroup;
  categories: Category[];
  categoryEntities: Dictionary<Category>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private dialogRef: MatDialogRef<TransactionEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { editMode: boolean, transaction: Transaction },
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
      this.categories = Object.values(categoryEntities);
    })
    this.title = this.data.editMode ? '编辑账目' : '添加账目';
    this.buildForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    console.log('form', this.formGroup.controls['amount']);

    this.loading = true;

    const action = this.data.editMode ?
      updateTransaction({ transaction: this.editedTransaction }) :
      addTransaction({ transaction: this.editedTransaction });

    this.store.dispatch(action);
  }

  private get editedTransaction(): Partial<Transaction> {
    const formValue = this.formGroup.value;
    let amount = Number.parseInt(formValue.amount.toFixed(2), 10);

    if (this.categoryEntities[formValue.categoryId].type === 'spend') {
      amount = 0 - amount;
    }

    let transaction: Partial<Transaction> = {
      amount,
      description: formValue.description,
      categoryId: formValue.categoryId,
      transactionDate: typeof formValue.transactionDate === 'string' ?
        formValue.transactionDate : formValue.transactionDate.toISOString(),
      dateModified: this.now.toISOString(),
    };

    if (this.data.editMode) {
      transaction = {
        ...transaction,
        id: this.data.transaction.id,
        bookId: this.data.transaction.bookId,

        // TODO: remove after server can do this
        dateCreated: this.data.transaction.dateCreated
      };
    } else {
      transaction = {
        ...transaction,
        dateCreated: this.now.toISOString()
      }
    }

    return transaction;
  }

  private buildForm() {
    const initialFormData = this.getInitialFormData();
    this.formGroup = this.fb.group({
      amount: new FormControl(initialFormData.amount, [Validators.required, Validators.pattern(/^\d*(\.\d{0,2})?$/)]),
      description: new FormControl(initialFormData.description, Validators.maxLength(this.transactionDescriptionMaxLength)),
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
