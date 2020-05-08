import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../model/transaction';
import { TransactionVO } from '../../model/transactionVO';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent implements OnInit {

  @Input() transaction: TransactionVO;

  constructor() { }

  ngOnInit(): void {
  }

}
