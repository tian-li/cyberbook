import { createAction, props } from '@ngrx/store';
import { YearMonth } from '../../../shared/model/year-month';

export const setDisplayMonth = createAction('[UI] Set Display Month', props<{ displayMonth: string }>());
