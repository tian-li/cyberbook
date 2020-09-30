import { MessageThread } from '@cyberbook/core/model/message-thread';
import { RootState } from '@cyberbook/core/store';
import * as fromMessageThread from '@cyberbook/core/store/message-thread/message-thread.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as dayjs from 'dayjs';

const getSelectedMessageThreadId = (state: fromMessageThread.State) => state.selectedMessageThreadId;

export const selectMessageThreadState = createFeatureSelector<RootState, fromMessageThread.State>(
  fromMessageThread.messageThreadFeatureKey
);

export const selectSelectedMessageThreadId = createSelector(
  selectMessageThreadState,
  getSelectedMessageThreadId
);

export const {
  selectIds: selectMessageThreadIds,
  selectEntities: selectMessageThreadEntities,
  selectAll: selectAllMessageThreads,
  selectTotal: selectMessageThreadTotal,
} = fromMessageThread.adapter.getSelectors(selectMessageThreadState);


export const selectAllSortedMessageThreads = createSelector(
  selectAllMessageThreads,
  (messageThreads: MessageThread[]) => {
    return messageThreads
    .sort((a, b) => dayjs(b.lastMessageDate).valueOf() - dayjs(a.lastMessageDate).valueOf());
  }
);
