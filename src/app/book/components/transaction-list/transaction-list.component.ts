import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TransactionVO } from '../../model/transactionVO';
import * as fromSpendBook from '../../store';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  transactions$: Observable<TransactionVO[]>
  transactions: TransactionVO[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.transactions$ = this.store.pipe(select(fromSpendBook.selectAllTransactionsVO));

    this.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      console.log('transactions', transactions);
    });
  }

  isFirstOfDate(transaction: TransactionVO, index: number): boolean {
    return index > 0 && index < this.transactions.length - 1 &&
      transaction.transactionDate.getDate() !== this.transactions[index - 1].transactionDate.getDate();
  }

  /**
   * TODO
   * This isn't a good approach, time complexity is O(n^2)
   * It is possible to have a O(n) approach
   * @param date
   */
  daySummary(date: Date): { income: number, spend: number } {
    const summary: { income: number, spend: number } = {
      income: 0,
      spend: 0
    };

    this.transactions.forEach((transaction: TransactionVO) => {
      if (this.isSameDay(date, transaction.transactionDate)) {
        if (transaction.amount > 0) {
          summary.income += transaction.amount;
        } else {
          summary.spend -= transaction.amount;
        }
      }
    });
    return summary;
  }

  isSameDay(date1: Date, date2: Date) {
    return date1.toLocaleDateString() === date2.toLocaleDateString();
  }


}
