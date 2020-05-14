import { TransactionEditorComponent } from '@spend-book/shared/components/transaction-editor/transaction-editor.component';

export type ISOString = string;

export interface SpendSummary {
  income: number;
  spend: number;
}
