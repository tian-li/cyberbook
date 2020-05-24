import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { PeriodSummary } from '@spend-book/shared/model/helper-models';
import * as dayjs from 'dayjs';

export function getMonthSummary(transactionVOs: TransactionVO[], date: dayjs.Dayjs, scale: 'day' | 'month'): PeriodSummary {
  const periodSummary: PeriodSummary = {
    income: 0,
    spend: 0
  };

  transactionVOs
  .filter(t => {
    return dayjs(t.transactionDate).isSame(date, scale)
  })
  .forEach((transaction) => {
    if (transaction.amount > 0) {
      periodSummary.income += transaction.amount
    } else {
      periodSummary.spend -= transaction.amount
    }
  });


  return {
    income: Number.parseFloat(periodSummary.income.toFixed(2)),
    spend: Number.parseFloat(periodSummary.spend.toFixed(2))
  };
}
