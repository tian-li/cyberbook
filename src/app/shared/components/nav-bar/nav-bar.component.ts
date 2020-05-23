import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { fromUI } from '@spend-book/core/store';
import { TransactionEditorComponent } from '@spend-book/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@spend-book/shared/constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  dialogRef: MatDialogRef<any>;

  showToolbar$: Observable<boolean>;

  constructor(private dialog: MatDialog, private store: Store) {
  }

  ngOnInit() {
    this.showToolbar$ = this.store.pipe(select(fromUI.selectShowToolbar));
  }

  addTransaction() {
    this.dialogRef = this.dialog.open(TransactionEditorComponent, defaultTransactionEditorDialogConfig);
  }
}
