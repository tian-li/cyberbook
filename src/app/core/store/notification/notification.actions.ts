import { createAction, props } from '@ngrx/store';
import { SnackBar } from '../../model/snack-bar';

export const notifyWithSnackBar = createAction(
  '[Notification] Notify with Snack Bar',
  props<{ snackBar: Partial<SnackBar> }>()
);
