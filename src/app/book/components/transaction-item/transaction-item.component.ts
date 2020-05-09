import { Component, Input, OnInit } from '@angular/core';
import { TransactionVO } from '../../model/transactionVO';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent implements OnInit {

  @Input() transaction: TransactionVO;
  @Input() firstOfDate: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
