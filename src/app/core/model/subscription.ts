import * as dayjs from 'dayjs';
import { ISOString } from '../../shared/model/helper-models';

const today = dayjs();

export interface Subscription {
  id: string;
  userId: string;
  amount: number;
  description: string;
  frequency: SubscriptionFrequencyTypes;
  period: number;
  startDate: ISOString;
  endDate: ISOString;
  categoryId: string;
  dateCreated: ISOString;
  dateModified: ISOString;
  nextDate: ISOString;
  summary: string;
  totalAmount: number;
}

export interface FrequencyInfo {
  frequency: SubscriptionFrequencyTypes | 'custom';
  display: string;
  period?: number;
  every?: string | number;
}

export enum SubscriptionFrequencyTypes {
  day = 1,
  week = 2,
  month = 3,
  year = 4,
  minute = 5,
}

export const subscriptionFrequencies = [
  SubscriptionFrequencyTypes.day,
  SubscriptionFrequencyTypes.week,
  SubscriptionFrequencyTypes.month,
  SubscriptionFrequencyTypes.year,
];

export function hasSubscriptionEnded(endDate: string): boolean {
  return today.isAfter(endDate);
}
