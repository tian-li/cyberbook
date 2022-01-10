import { PrivateMessage } from '@cyberbook/core/model/private-message';
import { RootState } from '@cyberbook/core/store';
import * as fromPrivateMessage from '@cyberbook/core/store/private-message/private-message.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as dayjs from 'dayjs';

const getSelectedPrivateMessageId = (state: fromPrivateMessage.State) => state.selectedPrivateMessageId;

export const selectPrivateMessageState = createFeatureSelector<RootState, fromPrivateMessage.State>(
  fromPrivateMessage.privateMessageFeatureKey
);

export const selectSelectedPrivateMessageId = createSelector(
  selectPrivateMessageState,
  getSelectedPrivateMessageId
);

export const {
  selectIds: selectPrivateMessageIds,
  selectEntities: selectPrivateMessageEntities,
  selectAll: selectAllPrivateMessages,
  selectTotal: selectPrivateMessageTotal,
} = fromPrivateMessage.adapter.getSelectors(selectPrivateMessageState);

export const selectAllSortedPrivateMessagesByMessageThreadId = (messageThreadId: string) => 
  createSelector(
    selectAllPrivateMessages,
    (privateMessages: PrivateMessage[]) => {
      return privateMessages
      .filter((pm: PrivateMessage) => pm.messageThreadId === messageThreadId)
      .sort((a, b) => dayjs(b.dateCreated).valueOf() - dayjs(a.dateCreated).valueOf());
    }
  );
