import { Component, Input } from '@angular/core';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {
  @Input() transactionVOs: TransactionVO[];

  constructor() {
  }

  isFirstOfDate(transaction: TransactionVO, index: number): boolean {
    return index > 0 && index <= this.transactionVOs.length - 1 &&
      transaction.transactionDate.date() !== this.transactionVOs[index - 1].transactionDate.date();
  }
}
