import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { fromTransaction, fromUI, fromUser } from '@spend-book/core/store';
import * as dayjs from 'dayjs';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit, OnDestroy {
  user: User;
  registeredLength = 1;

  numberOfAllTransactions$: Observable<number>;
  darkThemeEnabled;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.numberOfAllTransactions$ = this.store.pipe(select(fromTransaction.selectTransactionTotal))

    this.store.pipe(
      select(fromUser.selectUser),
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User) => {
      this.user = user;
      this.registeredLength = dayjs().diff(dayjs(user.registeredDate), 'day') + 1;
    });

    this.store.pipe(
      select(fromUI.selectDarkThemeEnabled),
      takeUntil(this.unsubscribe$)
    ).subscribe(darkThemeEnabled => this.darkThemeEnabled = darkThemeEnabled);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.store.dispatch(fromUser.logout({ id: this.user.id }));
  }

  gotoAccountDetail() {
    if (this.user.registered) {
      this.router.navigate(['./profile'], { relativeTo: this.route });
    } else {
      this.router.navigate(['./authenticate'], { relativeTo: this.route });
    }
  }

  selectTheme() {
    this.router.navigate(['./theme'], { relativeTo: this.route });
  }

}
