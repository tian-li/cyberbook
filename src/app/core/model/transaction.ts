import { ISOString } from '@spend-book/shared/model/helper-models';

export interface Transaction {
  id: number;
  userId: string;
  bookId: number;
  amount: number;
  description: string;
  categoryId: number;
  transactionDate: ISOString;
  dateCreated: ISOString;
  dateModified: ISOString;
}

export const transactionDescriptionMaxLength: number = 10;
