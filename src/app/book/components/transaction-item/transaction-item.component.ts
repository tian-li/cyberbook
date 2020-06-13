import { animate, state, style, transition, trigger, } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { removeTransaction } from '@spend-book/core/store/transaction';
import { TransactionEditorComponent } from '@spend-book/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@spend-book/shared/constants';
import { SwipeInfo } from '@spend-book/shared/model/helper-models';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({})),
      state('out', style({})),
      transition('in => out', animate('0.2s ease-in', style({ transform: 'translateX(-100%)', height: 0 }))),
      transition('* => in', style({ transform: 'translateX(0)', height: '100%' })),
    ]),
    trigger('swipeDelete', [
      state('showDelete', style({ width: '{{widthPercentage}}' }), { params: { widthPercentage: 0 } }),
      state('hideDelete', style({ width: 0 })),
      transition('showDelete => hideDelete', animate('0.1s'))
    ])
  ]
})
export class TransactionItemComponent {
  @Input() transactionVO: TransactionVO;
  @Input() firstOfDate: boolean;

  readonly swipeDeleteThreshold = 0.2;

  widthPercentage = '0%';
  widthPercentageNumber = 0;

  // animate state
  swipeDeleteState = 'hideDelete';
  flyInOutState = 'in';

  constructor(private dialog: MatDialog, private store: Store) {
  }

  editTransaction() {
    this.dialog.open(TransactionEditorComponent, {
      ...defaultTransactionEditorDialogConfig,
      data: {
        editMode: true,
        transaction: {
          id: this.transactionVO.id,
          bookId: this.transactionVO.bookId,
          userId: this.transactionVO.userId,
          amount: this.transactionVO.amount,
          description: this.transactionVO.description,
          categoryId: this.transactionVO.categoryId,
          transactionDate: this.transactionVO.transactionDate.toISOString(),
          dateCreated: this.transactionVO.dateCreated.toISOString(),
          dateModified: this.transactionVO.dateModified.toISOString(),
        }
      }
    });
  }

  onSwipe(swipeInfo: SwipeInfo) {
    if (swipeInfo.direction === 'left') {
      this.swipeLeft(swipeInfo)
    }
  }

  swipeLeft(swipeInfo: SwipeInfo) {
    this.swipeDeleteState = 'showDelete';
    this.widthPercentage = `${(swipeInfo.percentage * 100).toFixed(2)}%`;
    this.widthPercentageNumber = swipeInfo.percentage;
  }

  onEndSwipe(percentage) {
    if (percentage >= this.swipeDeleteThreshold) {
      this.removeFromList();
    } else {
      this.cancelSwipe();
    }
  }

  cancelSwipe() {
    this.swipeDeleteState = 'hideDelete';
  }

  removeFromList() {
    this.flyInOutState = 'out';
  }

  delete(event) {
    console.log('event', event);
    if (event.triggerName === 'flyInOut' && event.toState === 'out') {
      console.log('')
      this.store.dispatch(removeTransaction({ id: this.transactionVO.id }));
      this.flyInOutState = 'in';
      this.swipeDeleteState = 'hideDelete';
    }
  }
}
