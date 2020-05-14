import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionEditorComponent } from '@spend-book/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@spend-book/shared/constants';
import { TransactionVO } from '../../model/transactionVO';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent {
  @Input() transactionVO: TransactionVO;
  @Input() firstOfDate: boolean;

  constructor(private dialog: MatDialog) {
  }

  editTransaction() {
    this.dialog.open(TransactionEditorComponent, {
      ...defaultTransactionEditorDialogConfig,
      data: {
        editMode: true,
        transaction: {
          id: this.transactionVO.id,
          bookId: this.transactionVO.bookId,
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
