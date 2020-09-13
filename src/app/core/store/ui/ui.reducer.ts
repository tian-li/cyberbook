import { Action, createReducer, on } from '@ngrx/store';
import * as categoryActions from '@spend-book/core/store/category/category.actions'
import * as subscriptionActions from '@spend-book/core/store/subscription/subscription.actions'
import * as transactionActions from '@spend-book/core/store/transaction/transaction.actions'
import { defaultThemeName } from '@spend-book/shared/constants';
import { ISOString } from '../../../shared/model/helper-models';
import { disableDarkTheme, enableDarkTheme, hideToolbar, setDisplayMonth, setTheme, showToolbar } from './ui.actions';

const today = new Date();

export const uiFeatureKey = 'ui';

export interface State {
  displayMonth: ISOString;
  showToolbar: boolean;
  darkThemeEnabled: boolean;
  themeName: string;
  loading: boolean;
}

export const initialState: State = {
  displayMonth: today.toISOString(),
  showToolbar: true,
  darkThemeEnabled: false,
  themeName: defaultThemeName,
  loading: false,
};

const reducer = createReducer(
  initialState,
  on(setDisplayMonth, (state, { displayMonth }) => ({ ...state, displayMonth })),
  on(showToolbar, (state) => ({ ...state, showToolbar: true })),
  on(hideToolbar, (state) => ({ ...state, showToolbar: false })),
  on(enableDarkTheme, (state) => ({ ...state, darkThemeEnabled: true, themeName: 'dark' })),
  on(disableDarkTheme, (state) => ({ ...state, darkThemeEnabled: false, themeName: 'default' })),
  on(setTheme, (state, { themeName }) => ({ ...state, themeName })),

  on(
    categoryActions.addCategory, categoryActions.updateCategory, categoryActions.removeCategory,
    subscriptionActions.addSubscription, subscriptionActions.updateSubscription, subscriptionActions.removeSubscription, subscriptionActions.stopSubscription,
    transactionActions.addTransaction, transactionActions.updateTransaction, transactionActions.removeTransaction,
    (state => {
      return {
        ...state,
        loading: true
      }
    })
  ),
  on(
    categoryActions.addCategorySuccess, categoryActions.updateCategorySuccess, categoryActions.removeCategorySuccess,
    transactionActions.addTransactionSuccess, transactionActions.updateTransactionSuccess, transactionActions.removeTransactionSuccess,
    subscriptionActions.addSubscriptionSuccess, subscriptionActions.updateSubscriptionSuccess, subscriptionActions.removeSubscriptionSuccess, subscriptionActions.stopSubscriptionSuccess,
    (state => {
      return {
        ...state,
        loading: false
      }
    })
  )
);

export function uiReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

