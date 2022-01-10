import { hasSubscriptionEnded, Subscription } from '@cyberbook/core/model/subscription';
import { RootState } from '@cyberbook/core/store';
import * as fromSubscription from '@cyberbook/core/store/subscription/subscription.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as dayjs from 'dayjs';

const getSelectedSubscriptionId = (state: fromSubscription.State) => state.selectedSubscriptionId;

export const selectSubscriptionState = createFeatureSelector<RootState, fromSubscription.State>(
  fromSubscription.subscriptionFeatureKey
);

export const selectSelectedSubscriptionId = createSelector(
  selectSubscriptionState,
  getSelectedSubscriptionId
);

export const {
  selectIds: selectSubscriptionIds,
  selectEntities: selectSubscriptionEntities,
  selectAll: selectAllSubscriptions,
  selectTotal: selectSubscriptionTotal,
} = fromSubscription.adapter.getSelectors(selectSubscriptionState);

export const selectAllSubscriptionsOrderByModifiedDate = createSelector(
  selectAllSubscriptions,
  (subscriptions: Subscription[]) => {
    return subscriptions.sort((a, b) => {
      return dayjs(b.dateModified).valueOf() - dayjs(a.dateModified).valueOf();
    });
  }
);

export const getSubscriptionCountByCategoryId = (categoryId: string) =>
  createSelector(
    selectAllSubscriptions,
    (subscriptions: Subscription[]) => {
      return subscriptions.filter(s => s.categoryId === categoryId).length;
    }
  );

export const selectAllSubscriptionsByActiveStatus = (active: boolean) =>
  createSelector(
    selectAllSubscriptionsOrderByModifiedDate,
    (subscriptions: Subscription[]) => {
      return subscriptions.filter((s: Subscription) => s.activateStatus === active);
    }
  );
