import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { fromUI, fromUser } from '@spend-book/core/store';
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
  user: User;

  showToolbar$: Observable<boolean>;

  constructor(private dialog: MatDialog, private store: Store) {
  }

  ngOnInit() {
    this.showToolbar$ = this.store.pipe(select(fromUI.selectShowToolbar));
    this.store.pipe(select(fromUser.selectUser)).subscribe(user => this.user = user);
  }

  addTransaction() {
    this.dialogRef = this.dialog.open(TransactionEditorComponent, {
      ...defaultTransactionEditorDialogConfig,
      data: {
        ...defaultTransactionEditorDialogConfig.data,
        userId: this.user.id
      }
    });
  }
}
