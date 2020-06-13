export type ISOString = string;
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
