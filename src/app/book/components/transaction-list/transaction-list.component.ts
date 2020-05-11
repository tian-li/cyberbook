import { Component, Input } from '@angular/core';
import { TransactionVO } from '../../model/transactionVO';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  @Input() transactions: TransactionVO[];

  constructor() {
  }

  isFirstOfDate(transaction: TransactionVO, index: number): boolean {
    return index > 0 && index < this.transactions.length - 1 &&
      transaction.transactionDate.getDate() !== this.transactions[index - 1].transactionDate.getDate();
  }
}
