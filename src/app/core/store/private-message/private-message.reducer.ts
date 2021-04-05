import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { logout } from '@cyberbook/core/store/user/user.actions';
import { PrivateMessage } from '../../model/private-message';
import { loadPrivateMessagesByMessageThreadIdSuccess, sendPrivateMessageSuccess } from './private-message.actions';

export const privateMessageFeatureKey = 'privateMessage';

export interface State extends EntityState<PrivateMessage> {
  selectedPrivateMessageId: number | string;
}

export const adapter: EntityAdapter<PrivateMessage> = createEntityAdapter<PrivateMessage>({
  selectId: (privateMessage: PrivateMessage) => privateMessage.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedPrivateMessageId: null,
});

const reducer = createReducer(
  initialState,
  on(loadPrivateMessagesByMessageThreadIdSuccess, (state, { privateMessages }) =>
    adapter.setAll(privateMessages, { ...state, selectedPrivateMessageId: null })),
  on(sendPrivateMessageSuccess, (state, { privateMessage }) =>
    adapter.addOne(privateMessage, {
      ...state,
      selectedPrivateMessageId: privateMessage.id,
    })),
  on(logout, (state) => initialState),
);

export function privateMessageReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
