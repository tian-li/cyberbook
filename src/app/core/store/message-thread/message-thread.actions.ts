import { MessageThread } from '@cyberbook/core/model/message-thread';
import { createAction, props } from '@ngrx/store';

export const loadAllMessageThreadsByUser = createAction('[Message Thread] Load All Message Threads By User');
export const loadAllMessageThreadsByUserSuccess = createAction(
  '[Private Message] Load All Message Threads By User Success',
  props<{ messageThreads: MessageThread[] }>()
);

export const loadMessageThreadById = createAction(
  '[Message Thread] Load Message Thread By Id',
  props<{messageThreadId: string}>()
);
export const loadMessageThreadByIdSuccess = createAction(
  '[Message Thread] Load Message Thread By Id Success',
  props<{messageThread: MessageThread}>()
);
