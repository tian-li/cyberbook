import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionType, TransactionTypes } from '@spend-book/shared/constants';

@Component({
  selector: 'app-category-type-switcher',
  templateUrl: './category-type-switcher.component.html',
  styleUrls: ['./category-type-switcher.component.scss']
})
export class CategoryTypeSwitcherComponent {
  readonly TransactionTypes = TransactionTypes;

  /**
   * Show 'both' type or not, defaults to false, only show 'spend' and 'income'.
   */
  @Input() showBoth: boolean = false;
  @Input() types: {value: string, display: string}[];

  @Output() categoryTypeChanged: EventEmitter<TransactionType> = new EventEmitter<TransactionType>();

  selectedTransactionType: TransactionType = TransactionTypes.spend;

  changeType(type: string) {

  }

  changeTransactionType(type: TransactionType) {
    this.selectedTransactionType = type;
    this.categoryTypeChanged.emit(type);
  }

}
