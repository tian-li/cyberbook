import { Component, Input } from '@angular/core';
import { TransactionVO } from '@spend-book/core/model/transactionVO';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  @Input() transactionVOs: TransactionVO[];

  constructor() {
  }

  isFirstOfDate(transaction: TransactionVO, index: number): boolean {
    return index > 0 && index <= this.transactionVOs.length - 1 &&
      transaction.transactionDate.getDate() !== this.transactionVOs[index - 1].transactionDate.getDate();
  }
}
