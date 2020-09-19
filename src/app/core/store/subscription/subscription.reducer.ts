import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { logout } from '@cyberbook/core/store/user/user.actions';

import { Subscription } from '../../model/subscription';
import {
  addSubscriptionSuccess,
  loadSubscriptionsByUserSuccess,
  removeSubscription,
  stopSubscriptionSuccess,
  updateSubscriptionSuccess
} from './subscription.actions';

export const subscriptionFeatureKey = 'subscription';

export interface State extends EntityState<Subscription> {
  selectedSubscriptionId: number;
}

export const adapter: EntityAdapter<Subscription> = createEntityAdapter<Subscription>({
  selectId: (subscription: Subscription) => subscription.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedSubscriptionId: null,
});

const reducer = createReducer(
  initialState,
  on(loadSubscriptionsByUserSuccess, (state, { subscriptions }) =>
    adapter.setAll(subscriptions, { ...state, selectedSubscriptionId: null })),
  on(addSubscriptionSuccess, (state, { subscription }) =>
    adapter.addOne(subscription, {
      ...state,
      selectedSubscriptionId: subscription.id,
    })),
  on(updateSubscriptionSuccess, (state, { update }) =>
    adapter.updateOne(update, { ...state, selectedSubscriptionId: update.id })),
  on(stopSubscriptionSuccess, (state, { update }) =>
    adapter.updateOne(update, { ...state, selectedSubscriptionId: update.id })),
  on(removeSubscription, (state, { id }) =>
    adapter.removeOne(id, { ...state, selectedSubscriptionId: null })),
  on(logout, (state) => initialState),
);

export function subscriptionReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
