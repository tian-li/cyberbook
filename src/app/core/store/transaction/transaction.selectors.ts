import { Category } from '@cyberbook/core/model/category';
import { Transaction } from '@cyberbook/core/model/transaction';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';
import { RootState } from '@cyberbook/core/store';
import * as fromTransaction from '@cyberbook/core/store/transaction/transaction.reducer';
import { PeriodSummary } from '@cyberbook/shared/model/helper-models';
import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCategoryEntities } from '../category';

const getSelectedTransactionId = (state: fromTransaction.State) => state.selectedTransactionId;

export const selectTransactionState = createFeatureSelector<RootState, fromTransaction.State>(
  fromTransaction.transactionFeatureKey
);

export const selectSelectedTransactionId = createSelector(
  selectTransactionState,
  getSelectedTransactionId
);

export const selectTransactionIdsByDate = createSelector(
  selectTransactionState,
  (state: fromTransaction.State) => state.transactionIdsByDate
);

export const {
  selectIds: selectTransactionIds,
  selectEntities: selectTransactionEntities,
  selectAll: selectAllTransactions,
  selectTotal: selectTransactionTotal,
} = fromTransaction.adapter.getSelectors(selectTransactionState);

export const selectAllTransactionVOs = createSelector(selectCategoryEntities,
  selectAllTransactions,
  (categories: Dictionary<Category>, transactions: Transaction[]) => {
    if (Object.keys(categories).length <= 0 || transactions.length <= 0) {
      return [];
    }
    return transactions
    .map((transaction: Transaction) =>
      new TransactionVO({
        ...transaction,
        categoryName: categories[transaction.categoryId].name,
        categoryColor: categories[transaction.categoryId].color,
        categoryType: categories[transaction.categoryId].type,
        description: transaction.description,
        icon: categories[transaction.categoryId].icon
      })
    )
    // 先按 transactionDate，再按 dateModified，较新的放前面
    .sort((a: TransactionVO, b: TransactionVO) =>
      b.transactionDate.valueOf() - a.transactionDate.valueOf() ||
      b.dateModified.valueOf() - a.dateModified.valueOf()
    );
  }
);

export const selectAllTransactionVOsByYearMonth = (displayMonth: Date) => 
  createSelector(
    selectAllTransactionVOs,
    (transactionVOs: TransactionVO[]) => {
      const year: number = displayMonth.getFullYear();
      const month: number = displayMonth.getMonth();
      return transactionVOs.filter(
        (transactionVO: TransactionVO) => transactionVO.transactionDate.year() === year &&
          transactionVO.transactionDate.month() === month
      );
    }
  );

export const getTransactionSummaryByDate = (date: string) => 
  createSelector(
    selectTransactionEntities,
    selectTransactionIdsByDate,
    (transactionEntities: Dictionary<Transaction>, transactionIdsByDate) => {
      const summary = {
        income: 0,
        spend: 0
      };
      transactionIdsByDate[date].forEach(id => {
        const transaction = transactionEntities[id];
        if (transaction.amount > 0) {
          summary.income += transaction.amount;
        } else {
          summary.spend -= transaction.amount;
        }
      });
      return summary;
    }
  );

export const getTransactionSummaryByMonth = (displayMonth: Date) => 
  createSelector(
    selectAllTransactionVOsByYearMonth(displayMonth),
    (transactionVOs: TransactionVO[]) => {
      const monthSummary: PeriodSummary = {
        income: 0,
        spend: 0
      };

      transactionVOs.forEach((transaction) => {
        if (transaction.amount > 0) {
          monthSummary.income += transaction.amount;
        } else {
          monthSummary.spend -= transaction.amount;
        }
      });
      return monthSummary;
    }
  );

export const getTransactionCountByCategoryId = (categoryId: string) =>
  createSelector(
    selectAllTransactions,
    (transitions: Transaction[]) => {
      return transitions.filter(t => t.categoryId === categoryId).length;
    }
  );
