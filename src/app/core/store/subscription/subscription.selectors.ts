import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { Subscription, hasSubscriptionEnded } from '@spend-book/core/model/subscription';
import { RootState } from '@spend-book/core/store';
import { selectAllSortedCategories } from '@spend-book/core/store/category';
import * as fromSubscription from '@spend-book/core/store/subscription/subscription.reducer';

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

export const getSubscriptionCountByCategoryId = createSelector(
  selectAllSubscriptions,
  (transitions: Subscription[], props: { categoryId: string }) => {
    return transitions.filter(t => t.categoryId === props.categoryId).length;
  }
);

export const selectAllSubscriptionsByActiveStatus = createSelector(
  selectAllSubscriptions,
  (subscriptions: Subscription[], props: { active: boolean }) => {
    return subscriptions.filter((s: Subscription) => {
      const isActive = !hasSubscriptionEnded(s.endDate);
      return isActive === props.active;
    });
  }
)
