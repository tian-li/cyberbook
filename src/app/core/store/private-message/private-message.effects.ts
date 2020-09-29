import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification/notification.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { PrivateMessage } from '../../model/private-message';
import { PrivateMessageService } from '../../services/private-message.service';
import {
  loadPrivateMessagesByMessageThreadId, loadPrivateMessagesByMessageThreadIdSuccess,
  sendPrivateMessage,
  sendPrivateMessageSuccess
} from './private-message.actions';

@Injectable()
export class PrivateMessageEffects {

  loadPrivateMessagesByMessageThreadId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPrivateMessagesByMessageThreadId),
      switchMap(action =>
        this.privateMessageService.loadPrivateMessagesByMessageThreadId(action.messageThreadId).pipe(
          map((privateMessages: PrivateMessage[]) => loadPrivateMessagesByMessageThreadIdSuccess({ privateMessages })),
        ))
    )
  );

  addPrivateMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendPrivateMessage),
      mergeMap(action =>
        this.privateMessageService.sendPrivateMessage(action.privateMessage).pipe(
          map((privateMessage: PrivateMessage) => {
            // this.closePrivateMessageEditor();
            return sendPrivateMessageSuccess({ privateMessage });
          }),
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private privateMessageService: PrivateMessageService,
    private matDialog: MatDialog
  ) {
  }
}
