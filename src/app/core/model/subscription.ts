import * as dayjs from 'dayjs';
import { ISOString } from '../../shared/model/helper-models';

const today = dayjs();

export interface Subscription {
  id: string;
  userId: string;
  amount: number;
  description: string;
  frequency: SubscriptionFrequencyTypes;
  interval: number;
  // every: number;
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
  interval?: number;
  every?: string| number;
}

export enum SubscriptionFrequencyTypes {
  day = '天',
  week = '星期',
  month = '月',
  year = '年',
}

export const subscriptionFrequencies = [
   SubscriptionFrequencyTypes.day,
   SubscriptionFrequencyTypes.week,
   SubscriptionFrequencyTypes.month,
   SubscriptionFrequencyTypes.year,
]

export function hasSubscriptionEnded(endDate: string): boolean {
  return today.isAfter(endDate);
}
