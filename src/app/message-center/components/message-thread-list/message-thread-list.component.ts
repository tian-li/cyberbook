import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageThread } from '@cyberbook/core/model/message-thread';
import { fromMessageThread } from '@cyberbook/core/store';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-message-thread-list',
  templateUrl: './message-thread-list.component.html',
  styleUrls: ['./message-thread-list.component.scss']
})
export class MessageThreadListComponent implements OnInit, OnDestroy {

  allMessageThreads: MessageThread[];
  today: dayjs.Dayjs;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromMessageThread.selectAllSortedMessageThreads),
      takeUntil(this.unsubscribe$)
    ).subscribe(allMessageThreads => {
      this.allMessageThreads = allMessageThreads;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
