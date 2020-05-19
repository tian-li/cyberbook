import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { Transaction } from '@spend-book/core/model/transaction';

export const years: number[] = (() => {
  const today = new Date();
  const allowedYears: number[] = [];
  for(let i = today.getFullYear() - 5; i <= today.getFullYear() + 5; i++) {
    allowedYears.push(i);
  }
  return allowedYears;
})();

export const months: string[] = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

export const transactionEditorDialogId = 'TransactionEditor';



export const defaultTransactionEditorDialogConfig: MatDialogConfig<{ editMode: boolean, transaction?: Transaction }> = {
  id: transactionEditorDialogId,
  width: '400px',
  height: '400px',
  disableClose: true,
  data: { editMode: false }
}

export enum TransactionType {
  spend,
  income,
}
