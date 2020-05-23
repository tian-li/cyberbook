import { Action, createReducer, on } from '@ngrx/store';
import { ISOString } from '../../../shared/model/helper-models';
import { hideToolbar, setDisplayMonth, showToolbar } from './ui.actions';

const today = new Date();

export const uiFeatureKey = 'ui';

export interface State {
  displayMonth: ISOString;
  showToolbar: boolean;
}

export const initialState: State = {
  displayMonth: today.toISOString(),
  showToolbar: true,
};

const reducer = createReducer(
  initialState,
  on(setDisplayMonth, (state, { displayMonth }) => ({ ...state, displayMonth })),
  on(showToolbar, (state) => ({ ...state, showToolbar: true })),
  on(hideToolbar, (state) => ({ ...state, showToolbar: false })),
);

export function uiReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

// export const selectDisplayMonth = (state: State) => state.displayMonth;
