import { ISOString } from '@spend-book/shared/model/helper-models';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  transactionDate: ISOString;
  dateCreated: ISOString;
  dateModified: ISOString;
}

export const transactionDescriptionMaxLength: number = 10;
