import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageThread } from '@cyberbook/core/model/message-thread';
import { User } from '@cyberbook/core/model/user';
import { fromMessageThread, fromUser } from '@cyberbook/core/store';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-message-center-home',
  templateUrl: './message-center-home.component.html',
  styleUrls: ['./message-center-home.component.scss']
})
export class MessageCenterHomeComponent implements OnInit, OnDestroy {
  readonly today = dayjs();

  user: Partial<User>;
  allMessageThreads: MessageThread[];

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(fromMessageThread.loadAllMessageThreadsByUser());

    this.store.pipe(
      select(fromUser.selectUser),
      take(1)
    ).subscribe(user => {
      this.user = user;
      this.store.dispatch(fromMessageThread.loadAllMessageThreadsByUser());
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
