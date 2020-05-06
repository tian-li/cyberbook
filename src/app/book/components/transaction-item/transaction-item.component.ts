import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../model/transaction';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent implements OnInit {

  @Input() transaction: Transaction;

  constructor() { }

  ngOnInit(): void {
  }

}
