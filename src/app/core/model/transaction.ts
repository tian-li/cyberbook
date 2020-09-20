import { ISOString } from '@cyberbook/shared/model/helper-models';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  transactionDate: ISOString;
  dateCreated: ISOString;
  dateModified: ISOString;
  subscriptionId?: string;
}

export const transactionDescriptionMaxLength = 10;
