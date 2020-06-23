import { TransactionType } from '@spend-book/shared/constants';

export interface Category {
  id: string;
  userId: string;
  sortOrder: number;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  addedByUser: boolean;
}
