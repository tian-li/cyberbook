import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification/notification.actions';
import { feedbackDialogId, transactionEditorDialogId } from '@cyberbook/shared/constants';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { PrivateMessage } from '../../model/private-message';
import { PrivateMessageService } from '../../services/private-message.service';
import {
  loadPrivateMessagesByMessageThreadId, loadPrivateMessagesByMessageThreadIdSuccess, sendFeedback, sendFeedbackSuccess,
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

  sendPrivateMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendPrivateMessage),
      mergeMap(action =>
        this.privateMessageService.sendPrivateMessage(action.privateMessage).pipe(
          map((privateMessage: PrivateMessage) => {
            return sendPrivateMessageSuccess({ privateMessage });
          }),
        ))
    )
  );

  sendFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendFeedback),
      mergeMap(action =>
        this.privateMessageService.sendPrivateMessage(action.privateMessage).pipe(
          map((privateMessage: PrivateMessage) => {
            this.closePrivateMessageEditor('feedback success');
            return sendFeedbackSuccess({ privateMessage });
          }),
        ))
    )
  );

  closePrivateMessageEditor(message?: string) {
    const feedbackDialog = this.matDialog.getDialogById(feedbackDialogId);
    if (!!feedbackDialog) {
      feedbackDialog.close(message);
    }
  }

  constructor(
    private actions$: Actions,
    private privateMessageService: PrivateMessageService,
    private matDialog: MatDialog
  ) {
  }
}
