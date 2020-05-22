import { createAction, props } from '@ngrx/store';
import { SnackBar } from '@spend-book/shared/model/snack-bar';

export const notifyWithSnackBar = createAction(
  '[Notification] Notify with Snack Bar',
  props<{ snackBar: Partial<SnackBar> }>()
);
