import { ISOString } from '../../shared/model/helper-models';

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

// export const subscriptionFrequencies = [
//   { frequency: SubscriptionFrequencyTypes.day, display: '每天' },
//   { frequency: SubscriptionFrequencyTypes.week, display: '每周' },
//   { frequency: SubscriptionFrequencyTypes.month, display: '每月' },
//   { frequency: SubscriptionFrequencyTypes.year, display: '每年' },
//   { frequency: SubscriptionFrequencyTypes.custom, display: '自定义' }
// ]


export const subscriptionFrequencies = [
   SubscriptionFrequencyTypes.day,
   SubscriptionFrequencyTypes.week,
   SubscriptionFrequencyTypes.month,
   SubscriptionFrequencyTypes.year,
]
