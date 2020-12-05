import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@cyberbook/core/model/user';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { TransactionEditorComponent } from '@cyberbook/shared/components/transaction-editor/transaction-editor.component';
import { defaultTransactionEditorDialogConfig } from '@cyberbook/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('rotateAddButton', [
      state('open', style({ transform: 'rotate(135deg)' })),
      state('closed', style({ transform: 'rotate(0)' })),
      transition('closed => open', animate('0.2s ease')),
      transition('open => closed', animate('0.2s ease')),
    ])
  ]
})
export class NavBarComponent implements OnInit, OnDestroy {
  user: Partial<User>;
  addButtonAnimateState = 'closed';

  showToolbar$: Observable<boolean>;

  private unsubscribe$ = new Subject();

  constructor(private dialog: MatDialog, private store: Store) {
  }

  ngOnInit() {
    this.showToolbar$ = this.store.pipe(select(fromUI.selectShowToolbar));
    this.store.pipe(
      select(fromUser.selectUser),
      takeUntil(this.unsubscribe$)
    ).subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addTransaction() {
    this.addButtonAnimateState = 'open';

    this.dialog.open(TransactionEditorComponent, {
      ...defaultTransactionEditorDialogConfig,
      data: defaultTransactionEditorDialogConfig.data,
    }).afterClosed().pipe(take(1)).subscribe(() => {
      this.addButtonAnimateState = 'closed';
    });
  }

  developing() {
    this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '开发中的功能', duration: 10000000 } }));
  }
}
