import { Action, createReducer, on } from '@ngrx/store';
import { YearMonth } from '../../../shared/model/year-month';
import { setDisplayMonth } from './ui.actions';

const today = new Date();

export interface State {
  displayMonth: string;
}

export const initialState: State = {
  displayMonth: today.toISOString()
};

const reducer = createReducer(
  initialState,
  on(setDisplayMonth, (state, { displayMonth }) => ({ ...state, displayMonth })),
);

export function uiReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const selectDisplayMonth = (state: State) => state.displayMonth;
