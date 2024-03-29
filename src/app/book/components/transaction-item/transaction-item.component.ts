import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';
import { removeTransaction } from '@cyberbook/core/store/transaction';
import { TransactionEditorComponent } from '@cyberbook/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@cyberbook/shared/constants';
import { SwipeResult } from '@cyberbook/shared/model/helper-models';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent {
  @Input() transactionVO!: TransactionVO;
  @Input() firstOfDate!: boolean;

  constructor(private dialog: MatDialog, private store: Store) {
  }

  delete(event: SwipeResult) {
    if (event.direction === 'left' && event.result) {
      this.store.dispatch(removeTransaction({ id: this.transactionVO.id }));
    }
  }

  editTransaction() {
    this.dialog.open(TransactionEditorComponent, {
      ...defaultTransactionEditorDialogConfig,
      data: {
        editMode: true,
        transaction: {
          id: this.transactionVO.id,
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
}
