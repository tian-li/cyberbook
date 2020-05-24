import { InjectionToken } from '@angular/core';
import { Action, ActionReducer, ActionReducerMap, MetaReducer, } from '@ngrx/store';
import * as  fromUser from '@spend-book/core/store/user'
import * as  fromBook from '@spend-book/core/store/book'
import * as  fromCategory from '@spend-book/core/store/category'
import * as  fromTransaction from '@spend-book/core/store/transaction'
import * as  fromUI from '@spend-book/core/store/ui'
import { environment } from '../../../environments/environment';

export {
  fromUser,
  fromBook,
  fromCategory,
  fromTransaction,
  fromUI
};

export interface RootState {
  [fromUser.userFeatureKey]: fromUser.State;
  [fromBook.bookFeatureKey]: fromBook.State;
  [fromCategory.categoryFeatureKey]: fromCategory.State;
  [fromTransaction.transactionFeatureKey]: fromTransaction.State;
  [fromUI.uiFeatureKey]: fromUI.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<RootState, Action>>('Root reducers token', {
  factory: () => ({
    [fromUser.userFeatureKey]: fromUser.userReducer,
    [fromUI.uiFeatureKey]: fromUI.uiReducer,
    [fromBook.bookFeatureKey]: fromBook.bookReducer,
    [fromCategory.categoryFeatureKey]: fromCategory.categoryReducer,
    [fromTransaction.transactionFeatureKey]: fromTransaction.transactionReducer,
  }),
});

export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export const metaReducers: MetaReducer<RootState>[] = !environment.production
  ? [logger]
  : [];
