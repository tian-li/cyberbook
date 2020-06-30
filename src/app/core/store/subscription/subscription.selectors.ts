import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Subscription } from '@spend-book/core/model/subscription';
import { RootState } from '@spend-book/core/store';
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
