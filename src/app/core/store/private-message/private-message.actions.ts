import { createAction, props } from '@ngrx/store';
import { PrivateMessage } from '../../model/private-message';

export const loadPrivateMessagesByMessageThreadId = createAction(
  '[Private Message] Load Private Messages By Message Thread Id',
  props<{messageThreadId: string}>()
);
export const loadPrivateMessagesByMessageThreadIdSuccess = createAction(
  '[Private Message] Load Private Messages By Message Thread Id Success',
  props<{privateMessages: PrivateMessage[]}>()
);

export const sendPrivateMessage = createAction(
  '[Private Message] Send Private Message',
  props<{privateMessage: PrivateMessage}>()
);
export const sendPrivateMessageSuccess = createAction(
  '[Private Message] Send Private Message',
  props<{privateMessage: PrivateMessage}>()
);
