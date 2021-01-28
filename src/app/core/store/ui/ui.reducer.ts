import * as categoryActions from '@cyberbook/core/store/category/category.actions';
import * as subscriptionActions from '@cyberbook/core/store/subscription/subscription.actions';
import * as transactionActions from '@cyberbook/core/store/transaction/transaction.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { ISOString } from '../../../shared/model/helper-models';
import {
  hideLoadingSpinner,
  hideToolbar,
  setDisplayMonth,
  setIsWeChat,
  showLoadingSpinner,
  showToolbar
} from './ui.actions';

const today = new Date();

export const uiFeatureKey = 'ui';

export interface State {
  displayMonth: ISOString;
  showToolbar: boolean;
  darkThemeEnabled: boolean;
  loading: boolean;
  isWeChat: boolean;
}

export const initialState: State = {
  displayMonth: today.toISOString(),
  showToolbar: true,
  darkThemeEnabled: false,
  loading: false,
  isWeChat: false
};

const reducer = createReducer(
  initialState,
  on(setDisplayMonth, (state, { displayMonth }) => ({ ...state, displayMonth })),
  on(showToolbar, (state) => ({ ...state, showToolbar: true })),
  on(hideToolbar, (state) => ({ ...state, showToolbar: false })),
  on(setIsWeChat, (state) => ({ ...state, isWeChat: true })),
  on(
    categoryActions.addCategory, categoryActions.updateCategory, categoryActions.removeCategory,
    subscriptionActions.addSubscription, subscriptionActions.updateSubscription,
    subscriptionActions.removeSubscription, subscriptionActions.stopSubscription,
    transactionActions.addTransaction, transactionActions.updateTransaction, transactionActions.removeTransaction,
    showLoadingSpinner,
    (state => {
      return {
        ...state,
        loading: true
      };
    })
  ),
  on(
    categoryActions.addCategorySuccess, categoryActions.updateCategorySuccess, categoryActions.removeCategorySuccess,
    transactionActions.addTransactionSuccess, transactionActions.updateTransactionSuccess,
    transactionActions.removeTransactionSuccess,
    subscriptionActions.addSubscriptionSuccess, subscriptionActions.updateSubscriptionSuccess,
    subscriptionActions.removeSubscriptionSuccess, subscriptionActions.stopSubscriptionSuccess,
    hideLoadingSpinner,
    (state => {
      return {
        ...state,
        loading: false
      };
    })
  )
);

export function uiReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

