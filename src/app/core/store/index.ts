import { InjectionToken } from '@angular/core';
import * as  fromCategory from '@cyberbook/core/store/category';
import * as  fromSubscription from '@cyberbook/core/store/subscription';
import * as  fromTransaction from '@cyberbook/core/store/transaction';
import * as  fromUI from '@cyberbook/core/store/ui';
import * as  fromUser from '@cyberbook/core/store/user';
import * as  fromPrivateMessage from '@cyberbook/core/store/private-message';
import * as  fromMessageThread from '@cyberbook/core/store/message-thread';
import { Action, ActionReducer, ActionReducerMap, MetaReducer, } from '@ngrx/store';
import { environment } from '../../../environments/environment';

export {
  fromUser,
  fromCategory,
  fromTransaction,
  fromUI,
  fromSubscription,
  fromPrivateMessage,
  fromMessageThread
};

export interface RootState {
  [fromUser.userFeatureKey]: fromUser.State;
  [fromCategory.categoryFeatureKey]: fromCategory.State;
  [fromTransaction.transactionFeatureKey]: fromTransaction.State;
  [fromUI.uiFeatureKey]: fromUI.State;
  [fromSubscription.subscriptionFeatureKey]: fromSubscription.State;
  [fromPrivateMessage.privateMessageFeatureKey]: fromPrivateMessage.State;
  [fromMessageThread.messageThreadFeatureKey]: fromMessageThread.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<RootState, Action>>('Root reducers token', {
  factory: () => ({
    [fromUser.userFeatureKey]: fromUser.userReducer,
    [fromUI.uiFeatureKey]: fromUI.uiReducer,
    [fromCategory.categoryFeatureKey]: fromCategory.categoryReducer,
    [fromTransaction.transactionFeatureKey]: fromTransaction.transactionReducer,
    [fromSubscription.subscriptionFeatureKey]: fromSubscription.subscriptionReducer,
    [fromPrivateMessage.privateMessageFeatureKey]: fromPrivateMessage.privateMessageReducer,
    [fromMessageThread.messageThreadFeatureKey]: fromMessageThread.messageThreadReducer,
  }),
});

export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    // console.log('prev state', state);
    // console.log('action', action);
    // console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export const metaReducers: MetaReducer<RootState>[] = !environment.production
  ? [logger]
  : [];
