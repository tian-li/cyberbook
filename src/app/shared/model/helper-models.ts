import { AlertLevel } from '@spend-book/shared/constants';

export type ISOString = string;
export type FullDateType = string;
export const FullDate = 'MM/DD/YYYY';

export interface PeriodSummary {
  income: number;
  spend: number;
}

export interface YearMonth {
  year: number;
  month: number;
}

export type SwipeDirection = 'left' | 'right';

export interface SwipeInfo {
  direction: SwipeDirection;
  percentage: number;
}

export interface SwipeResult {
  direction: SwipeDirection;
  result: boolean;
}

export interface ConfirmationAlertData {
  message: string;
  title?: string;
  alertLevel?: AlertLevel;
  positiveAction?: string;
  negativeAction?: string;
}

