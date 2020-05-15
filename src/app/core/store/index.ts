import { InjectionToken } from '@angular/core';
import { Action, ActionReducer, ActionReducerMap, MetaReducer, } from '@ngrx/store';
import * as  fromAuth from '@spend-book/core/store/auth'
import * as  fromBook from '@spend-book/core/store/book'
import * as  fromCategory from '@spend-book/core/store/category'
import * as  fromTransaction from '@spend-book/core/store/transaction'
import * as  fromUI from '@spend-book/core/store/ui'
import { environment } from '../../../environments/environment';

export {
  fromAuth,
  fromBook,
  fromCategory,
  fromTransaction,
  fromUI
};

export interface RootState {
  [fromAuth.authFeatureKey]: fromAuth.State;
  [fromBook.bookFeatureKey]: fromBook.State;
  [fromCategory.categoryFeatureKey]: fromCategory.State;
  [fromTransaction.transactionFeatureKey]: fromTransaction.State;
  [fromUI.uiFeatureKey]: fromUI.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<RootState, Action>>('Root reducers token', {
  factory: () => ({
    [fromAuth.authFeatureKey]: fromAuth.authReducer,
    [fromUI.uiFeatureKey]: fromUI.uiReducer,
    [fromBook.bookFeatureKey]: fromBook.bookReducer,
    [fromCategory.categoryFeatureKey]: fromCategory.categoryReducer,
    [fromTransaction.transactionFeatureKey]: fromTransaction.transactionReducer,
  }),
});

// console.log all actions
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
