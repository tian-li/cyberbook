import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionEditorComponent } from '@spend-book/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@spend-book/shared/constants';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  dialogRef: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {
  }

  addTransaction() {
    this.dialogRef = this.dialog.open(TransactionEditorComponent, defaultTransactionEditorDialogConfig);
  }
}
