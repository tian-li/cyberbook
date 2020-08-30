import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Subscription } from '../../model/subscription';

export const loadSubscriptionsByUser = createAction('[Subscription] Load Subscriptions by User');
export const loadSubscriptionsByUserSuccess = createAction(
  '[Subscription] Load Subscriptions by User Success',
  props<{ subscriptions: Subscription[] }>()
);

export const addSubscription = createAction(
  '[Subscription] Add Subscription',
  props<{ subscription: Partial<Subscription> }>()
);
export const addSubscriptionSuccess = createAction(
  '[Subscription] Add Subscription Success',
  props<{ subscription: Subscription }>()
);

export const updateSubscription = createAction(
  '[Subscription] Update Subscription',
  props<{ update: Update<Subscription> }>()
);
export const updateSubscriptionSuccess = createAction(
  '[Subscription] Update Subscription Success',
  props<{ update: Update<Subscription> }>()
);

export const stopSubscription = createAction(
  '[Subscription] Stop Subscription',
  props<{ id: string }>()
);
export const stopSubscriptionSuccess = createAction(
  '[Subscription] Stop Subscription Success',
  props<{ update: Update<Subscription> }>()
);

export const removeSubscription = createAction('[Subscription] Remove Subscription', props<{ id: string }>());
export const removeSubscriptionSuccess = createAction('[Subscription] Remove Subscription Success');
