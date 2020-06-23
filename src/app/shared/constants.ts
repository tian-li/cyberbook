import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { Transaction } from '@spend-book/core/model/transaction';

export const years: number[] = (() => {
  const today = new Date();
  const allowedYears: number[] = [];
  for (let i = today.getFullYear() - 5; i <= today.getFullYear() + 5; i++) {
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
  spend = 'spend',
  income = 'income',
  both = 'both'
}

export const defaultThemeName = 'indigo-pink-theme';

export enum AlertLevel {
  warn,
  danger,
}

export const defaultPositiveAction = '好';
export const defaultNegativeAction = '取消';
export const defaultAlertLevel = AlertLevel.warn;

export const availableCategoryIcons = [
  'account_balance_wallet',
  'account_balance',
  'analytics',
  'book',
  'language',
  'verified_user',
  'brightness_auto',
  'insert_drive_file',
  'table_rows',
  'cloud_done',
  'computer',
  'phone_android',
  'devices_other',
  'headset_mic',
  'videogame_asset',
  'camera_roll',
  'storefront',
  'restaurant',
  'commute',
  'live_tv',
  'house',
  'pets',
  'school',
  'category',
  'account_balance_wallet',
  'local_atm',
];

export const availableCategoryColors = [
  '#f44444',
  '#e8682c',
  '#f8d339',
  '#c6f834',
  '#6ec232',
  '#2ad792',
  '#13b9d4',
  '#0928be',
  '#af34ed',
  '#cc048a',
];
