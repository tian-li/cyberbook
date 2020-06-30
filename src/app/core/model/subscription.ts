import { ISOString } from '../../shared/model/helper-models';

export interface Subscription {
  id: string;
  userId: string;
  amount: number;
  description: string;
  frequency: SubscriptionFrequency;
  interval: number;
  every: number;
  startDate: ISOString;
  endDate: ISOString;
  categoryId: string;
  dateCreated: ISOString;
  dateModified: ISOString;
  nextDate: ISOString;
}

export enum SubscriptionFrequency {
  day,
  week,
  month,
  year
}
