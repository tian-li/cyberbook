import { logout } from '@cyberbook/core/store/user/user.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { MessageThread } from '../../model/message-thread';
import { loadAllMessageThreadsByUserSuccess, loadMessageThreadByIdSuccess } from './message-thread.actions';

export const messageThreadFeatureKey = 'messageThread';

export interface State extends EntityState<MessageThread> {
  selectedMessageThreadId: number;
}

export const adapter: EntityAdapter<MessageThread> = createEntityAdapter<MessageThread>({
  selectId: (messageThread: MessageThread) => messageThread.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedMessageThreadId: null,
});

const reducer = createReducer(
  initialState,
  on(loadAllMessageThreadsByUserSuccess, (state, { messageThreads }) =>
    adapter.setAll(messageThreads, { ...state, selectedMessageThreadId: null })
  ),
  on(loadMessageThreadByIdSuccess, (state, { messageThread }) =>
    adapter.upsertOne(messageThread, { ...state, selectedMessageThreadId: messageThread.id })
  ),
  on(logout, (state) => initialState),
);

export function messageThreadReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
