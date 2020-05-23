import { createAction, props } from '@ngrx/store';
import { ISOString } from '../../../shared/model/helper-models';

export const setDisplayMonth = createAction('[UI] Set Display Month', props<{ displayMonth: ISOString }>());

export const showToolbar = createAction('[UI] Show Toolbar');
export const hideToolbar = createAction('[UI] Hide Toolbar');
