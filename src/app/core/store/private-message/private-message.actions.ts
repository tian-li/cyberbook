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
  props<{privateMessage: Partial<PrivateMessage>}>()
);
export const sendPrivateMessageSuccess = createAction(
  '[Private Message] Send Private Message Success',
  props<{privateMessage: PrivateMessage}>()
);

export const sendFeedback = createAction(
  '[Private Message] Send Feedback',
  props<{privateMessage: Partial<PrivateMessage>}>()
);
export const sendFeedbackSuccess = createAction(
  '[Private Message] Send Feedback Success',
  props<{privateMessage: PrivateMessage}>()
);
