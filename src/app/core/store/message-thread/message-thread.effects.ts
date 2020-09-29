import { Injectable } from '@angular/core';
import {
  loadAllMessageThreadsByUser,
  loadAllMessageThreadsByUserSuccess,
  loadMessageThreadById,
  loadMessageThreadByIdSuccess
} from '@cyberbook/core/store/message-thread/message-thread.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { MessageThread } from '../../model/message-thread';
import { MessageThreadService } from '../../services/message-thread.service';


@Injectable()
export class MessageThreadEffects {

  loadAllMessageThreadsByUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllMessageThreadsByUser),
      switchMap(() =>
        this.messageThreadService.loadAllMessageThreadsByUser().pipe(
          map((messageThreads: MessageThread[]) => loadAllMessageThreadsByUserSuccess({ messageThreads })),
        ))
    )
  );

  loadMessageThreadById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMessageThreadById),
      switchMap((action) =>
        this.messageThreadService.loadMessageThreadById(action.messageThreadId).pipe(
          map((messageThread: MessageThread) => loadMessageThreadByIdSuccess({ messageThread })),
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private messageThreadService: MessageThreadService,
  ) {
  }
}
